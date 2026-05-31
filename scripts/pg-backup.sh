#!/usr/bin/env bash
# PathWorks Postgres backup script for the self-hosted data LXC.
# Runs pg_dump inside the postgres container, writes a timestamped dump
# into /srv/pathworks-data/backups, and prunes anything older than
# BACKUP_RETENTION_DAYS (default 14).
#
# Install:
#   chmod +x /opt/pathworks/pg-backup.sh
#   crontab -e
#   0 3 * * * /opt/pathworks/pg-backup.sh >> /var/log/pathworks-backup.log 2>&1
#
# Restore (into a throwaway database):
#   docker compose -f /opt/pathworks/docker-compose.yml exec -T postgres \
#     psql -U "$POSTGRES_USER" -c 'CREATE DATABASE pathworks_restore;'
#   docker compose -f /opt/pathworks/docker-compose.yml exec -T postgres \
#     pg_restore -U "$POSTGRES_USER" -d pathworks_restore \
#     < /srv/pathworks-data/backups/pathworks-YYYY-MM-DD_HH-MM-SS.dump

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/srv/pathworks-data/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
COMPOSE_FILE="${COMPOSE_FILE:-/opt/pathworks/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-/etc/pathworks/.env}"

# Load POSTGRES_USER / POSTGRES_DB from the env file.
# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

mkdir -p "$BACKUP_DIR"

timestamp="$(date -u +%Y-%m-%d_%H-%M-%S)"
target="${BACKUP_DIR}/pathworks-${timestamp}.dump"

echo "[$(date -u +%FT%TZ)] starting backup -> $target"

# pg_dump in custom format so pg_restore can do parallel/selective restores
docker compose -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
  > "$target"

# Sanity check: dump must be non-empty
if [[ ! -s "$target" ]]; then
  echo "[$(date -u +%FT%TZ)] ERROR: backup is empty, leaving in place for inspection"
  exit 1
fi

echo "[$(date -u +%FT%TZ)] backup complete: $(du -h "$target" | cut -f1)"

# Prune old dumps
find "$BACKUP_DIR" -name 'pathworks-*.dump' -type f -mtime "+$RETENTION_DAYS" -print -delete

echo "[$(date -u +%FT%TZ)] retention sweep done (kept last $RETENTION_DAYS days)"

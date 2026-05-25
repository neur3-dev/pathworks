# PathWorks Docker Self-Hosting

PathWorks can run as a self-hosted stack for local evaluation and deployment testing.

## Quick Start

```bash
git clone https://github.com/neur3-dev/pathworks.git
cd pathworks
cp .env.example .env
./run-docker-full-stack.sh
```

Use the `pathworks` database name in local configuration:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pathworks
```

## Common Commands

```bash
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml ps
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml logs -f
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml down
```

Build service images manually:

```bash
docker build -f docker/Dockerfile.api -t pathworks/api:latest .
docker build -f docker/Dockerfile.dashboard -t pathworks/dashboard:latest .
```

Rebuild changed services:

```bash
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml up -d --build api
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml up -d --build api dashboard
```

Restart object storage:

```bash
docker compose --env-file .env -p pathworks -f docker/docker-compose.yaml restart minio
```

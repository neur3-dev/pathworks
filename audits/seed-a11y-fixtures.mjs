#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import fs from 'node:fs/promises';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const COMPOSE = [
  'compose',
  '--env-file',
  `${ROOT}/.env`,
  '-p',
  'pathworks',
  '-f',
  `${ROOT}/docker/docker-compose.yaml`
];
const participantId = '11111111-1111-4111-8111-111111111111';
const orgId = '22222222-2222-4222-8222-222222222222';
const groupId = '33333333-3333-4333-8333-333333333333';
const courseId = '44444444-4444-4444-8444-444444444444';
const lessonOneId = '55555555-5555-4555-8555-555555555551';
const lessonTwoId = '55555555-5555-4555-8555-555555555552';
const pathId = '66666666-6666-4666-8666-666666666666';
const counselorEmail = 'counselor.a11y@example.test';
const participantEmail = 'participant.a11y@example.test';

async function readDotEnv(path) {
  const values = {};
  const raw = await fs.readFile(path, 'utf8').catch(() => '');
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
  return values;
}

function runDocker(args, input) {
  const result = spawnSync('docker', [...COMPOSE, ...args], {
    cwd: ROOT,
    input,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    throw new Error(`docker ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
  }

  return result.stdout;
}

function base64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signJwt(payload, secret) {
  const header = base64url({ alg: 'HS256' });
  const body = base64url(payload);
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function signCounselorToken(email, secret) {
  const payload = Buffer.from(
    JSON.stringify({ email, type: 'pathworks-counselor', exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 })
  ).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

const sql = `
BEGIN;
INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
VALUES ('${participantId}', 'A11y Participant', '${participantEmail}', true, now(), now())
ON CONFLICT (id) DO UPDATE SET name = excluded.name, email = excluded.email, email_verified = true, updated_at = now();

INSERT INTO profile (id, fullname, username, email, is_email_verified, locale, updated_at)
VALUES ('${participantId}', 'A11y Participant', 'a11y_participant', '${participantEmail}', true, 'en', now())
ON CONFLICT (id) DO UPDATE SET fullname = excluded.fullname, email = excluded.email, updated_at = now();

INSERT INTO role (id, type, description, created_at, updated_at)
VALUES (1, 'learner', 'PathWorks accessibility audit learner', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organization (id, name, "siteName", created_at)
VALUES ('${orgId}', 'PathWorks A11y Audit', 'pathworks-a11y-audit', now())
ON CONFLICT (id) DO UPDATE SET name = excluded.name, "siteName" = excluded."siteName";

INSERT INTO organizationmember (organization_id, role_id, profile_id, email, verified)
VALUES ('${orgId}', 1, '${participantId}', '${participantEmail}', true)
ON CONFLICT (organization_id, profile_id) WHERE profile_id IS NOT NULL DO UPDATE SET verified = true, email = excluded.email;

INSERT INTO "group" (id, name, description, organization_id, created_at, updated_at)
VALUES ('${groupId}', 'A11y Learning Group', 'Fixture group for authenticated accessibility audits.', '${orgId}', now(), now())
ON CONFLICT (id) DO UPDATE SET name = excluded.name, organization_id = excluded.organization_id, updated_at = now();

INSERT INTO course (id, title, description, overview, group_id, is_template, slug, metadata, created_at, updated_at)
VALUES ('${courseId}', 'Work Readiness Foundations', 'Fixture course for authenticated accessibility audits.', 'Practice workplace readiness skills.', '${groupId}', false, 'a11y-work-readiness-foundations', '{"goals":"Work readiness","description":"A11y fixture","requirements":"","allowNewStudent":true}'::jsonb, now(), now())
ON CONFLICT (id) DO UPDATE SET title = excluded.title, group_id = excluded.group_id, updated_at = now();

INSERT INTO lesson (id, course_id, title, note, public, teacher_id, "order", created_at, updated_at)
VALUES
  ('${lessonOneId}', '${courseId}', 'Set a weekly work goal', 'Choose one measurable goal for the week.', true, '${participantId}', 1, now(), now()),
  ('${lessonTwoId}', '${courseId}', 'Practice an interview answer', 'Use the STAR format for a short answer.', true, '${participantId}', 2, now(), now())
ON CONFLICT (id) DO UPDATE SET title = excluded.title, course_id = excluded.course_id, updated_at = now();

INSERT INTO vr_participants (user_id, disability_category, pref_extended_time, pref_no_autoplay, pref_content_warnings, pref_microlearning, ipe_vocational_goal, counselor_name, counselor_email, updated_at)
VALUES ('${participantId}', 'cognitive', true, true, true, true, 'Build confidence for an entry-level office role.', 'A11y Counselor', '${counselorEmail}', now())
ON CONFLICT (user_id) DO UPDATE SET disability_category = excluded.disability_category, counselor_name = excluded.counselor_name, counselor_email = excluded.counselor_email, updated_at = now();

INSERT INTO participant_progress (user_id, course_id, lesson_id, status, last_position, score, attempts, completed_at, updated_at)
VALUES
  ('${participantId}', '${courseId}', '${lessonOneId}', 'completed', 100, 95, 1, now(), now()),
  ('${participantId}', '${courseId}', '${lessonTwoId}', 'in_progress', 40, null, 1, null, now())
ON CONFLICT DO NOTHING;

INSERT INTO learning_paths (id, org_id, title, description, pre_ets_domain, estimated_hours, created_at, updated_at)
VALUES ('${pathId}', '${orgId}', 'A11y Work Readiness Path', 'Fixture learning path for authenticated accessibility audits.', 'workplace_readiness', 2.0, now(), now())
ON CONFLICT (id) DO UPDATE SET title = excluded.title, org_id = excluded.org_id, updated_at = now();

INSERT INTO learning_path_courses (path_id, course_id, position)
VALUES ('${pathId}', '${courseId}', 1)
ON CONFLICT (path_id, course_id) DO UPDATE SET position = excluded.position;
COMMIT;
`;

runDocker(
  [
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    process.env.POSTGRES_USER || 'postgres',
    '-d',
    process.env.POSTGRES_DB || 'pathworks',
    '-v',
    'ON_ERROR_STOP=1'
  ],
  sql
);

const apiBaseUrl = (process.env.PATHWORKS_AXE_API_BASE_URL || 'http://127.0.0.1:3081').replace(/\/$/, '');
const baseUrl = (process.env.PATHWORKS_AXE_BASE_URL || 'http://127.0.0.1:3082').replace(/\/$/, '');
const envFile = await readDotEnv(`${ROOT}/.env`);
const authSecret = process.env.BETTER_AUTH_SECRET || envFile.BETTER_AUTH_SECRET || 'local-dev-only-secret-change-this';
const counselorSecret =
  process.env.BETTER_AUTH_SECRET ||
  process.env.PRIVATE_SERVER_KEY ||
  envFile.BETTER_AUTH_SECRET ||
  envFile.PRIVATE_SERVER_KEY ||
  'local-dev-only-secret-change-this';
const loginToken = signJwt(
  {
    sub: participantId,
    email: participantEmail,
    type: 'login-link',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 10 * 60
  },
  authSecret
);
const counselorToken = signCounselorToken(counselorEmail, counselorSecret);
const fixture = {
  baseUrl,
  participantLoginUrl: `${apiBaseUrl}/api/auth/login-link?token=${encodeURIComponent(loginToken)}&redirect=/lms/settings/accessibility`,
  urls: [
    '/lms/settings/accessibility',
    `/counselor?token=${encodeURIComponent(counselorToken)}`,
    `/counselor/${participantId}?token=${encodeURIComponent(counselorToken)}`
  ],
  participantId,
  counselorEmail
};

const outPath = process.argv[2] || `${ROOT}/audits/axe-fixtures.json`;
await fs.writeFile(outPath, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(`seeded PathWorks a11y fixtures and wrote ${outPath}`);

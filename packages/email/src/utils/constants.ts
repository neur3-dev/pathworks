import { env } from '../config/env';

export const EMAIL_IDS = [
  'forgotPassword',
  'inviteTeacher',
  'newsfeedComment',
  'newsfeedPost',
  'onPasswordReset',
  'participantSeatInvite',
  'programGoalReminder',
  'studentCourseInvite',
  'studentCourseCompletion',
  'studentCourseWelcome',
  'studentOrgInvite',
  'studentProgramWelcome',
  'studentProvePayment',
  'teacherCourseWelcome',
  'teacherStudentBuyRequest',
  'teacherStudentJoined',
  'verifyEmail',
  'welcome'
] as const;

const DEFAULT_EMAIL_FROM = '"Best from PathWorks" <notify@mail.pathworks.com>';

export const EMAIL_FROM = env.SMTP_SENDER || DEFAULT_EMAIL_FROM;
export const EMAIL_REPLY_TO = '"Best from PathWorks" <help@pathworks.com>';

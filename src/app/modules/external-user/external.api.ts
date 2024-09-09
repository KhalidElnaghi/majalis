export const EXTERNAL_API = {
  GET_MY_MEETINGS: (secret: string) => `api/mjalis/meetings/list/${secret}`,
  GET_POLLS: (secret: string) => `api/mjalis/votes/secret/${secret}`,
  GET_POLLS_BY_OTP: (secret: string) =>
    `api/mjalis/votes/otp/details/${secret}`,
  SEND_ATTENDANCE: 'api/mjalis/meetings/occurrences/attendance',
  SEND_VOTE: 'api/mjalis/votes/secret',
  SEND_VOTE_OTP: 'api/mjalis/votes/otp',
  GET_PREVIOUS_MEETING_MINUTES: (secret: string) =>
    `api/mjalis/meetings/occurrences/records/list/${secret}`,
  CHECK_MOBILE: (id: string) => `api/mjalis/votes/${id}/otp/request-otp`,
  CHECK_OTP: (id: string) => `api/mjalis/votes/${id}/otp/validate-otp`,
  GET_EXTERNAL_TOKEN: (secret: string) => `api/mjalis/idp-app-auth/${secret}`,
} as const;

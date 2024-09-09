export const MAIN_APP_API = {
  MAIN_DEPARTMENT: 'api/app/department/default-root-department',
  DEPARTMENT_DETAILS: (id: string) =>
    `api/app/department/${id}/department-list/`,
  ENTITY_LIST: 'api/app/entity/',
  PERMISSIONS: 'pes/authorize/resources',
} as const;

export const MAIN_MJALES_API = {
  // Committee
  COMMITTEE_LIST: 'api/mjalis/committees',
  COMMITTEE_ADD: 'api/mjalis/committees',
  COMMITTEE_RULES: 'api/mjalis/rules',
  COMMITTEE_SINGLE: 'api/mjalis/committees/',
  EDIT_COMMITTEE: (id: string) => `api/mjalis/committees/${id}`,
  DELETE_COMMITTEE: (id: string) => `api/mjalis/committees/${id}`,
  DELETE_COMMITTEES: 'api/mjalis/committees/range',

  // Members
  LIST_EXTERNAL_MEMBERS: 'api/mjalis/members/external',
  CREATE_EXTERNAL_MEMBERS: 'api/mjalis/members/external',
  DELETE_EXTERNAL_MEMBERS: 'api/mjalis/members/external/',

  // Meeting
  SINGLE_MEETING: (meetingId: string) => `api/mjalis/meetings/${meetingId}`,
  COMMITTEE_MEETINGS_LIST: (committeeId: string) =>
    `api/mjalis/meetings/${committeeId}/list`,
  CREATE_MEETING: (committeeId: string) =>
    `api/mjalis/meetings/${committeeId}/create`,
  MEETING_VALIDATE: (meetingId: string) =>
    `api/mjalis/meetings/${meetingId}/validate`,
  MEETING_VALIDATE_UPDATE: (meetingId: string, occurrenceId: string) =>
    `api/mjalis/meetings/${meetingId}/occurrences/${occurrenceId}/validate-update`,
  ADD_MEETING_TOPIC: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}/topics`,
  EDIT_MEETING_TOPIC: (occurrenceId: string, topicId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}/topics/${topicId}`,
  DELETE_MEETING_TOPIC: (occurrenceId: string, topicId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}/topics/${topicId}`,
  SAVE_MEETING_VOTE_SETTINGS: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}/voting-settings`,
  TOPICS_RESULT: (meetingId: string) => `api/mjalis/votes/${meetingId}/results`,
  COMMITTEE_DOCUMENTS: (committeeId: string) =>
    `api/mjalis/committees/${committeeId}/documents`,
  UPLOAD_COMMITTEE_DOCUMENTS: (committeeId: string) =>
    `api/mjalis/committees/${committeeId}/documents`,
  DELETE_COMMITTEE_DOCUMENT: (committeeId: string, documentId: string) =>
    `api/mjalis/committees/${committeeId}/documents/${documentId}`,
  GET_CREATE_MEETING_MINUTE: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}/record`,
  COMMITTEE_PREVIOUS_MEETING_MINUTES: (committeeId: string) =>
    `api/mjalis/committees/${committeeId}/record`,
  DELETE_MEETING_OCCURRENCE: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}`,
  MY_MEETING_LIST: `api/mjalis/meetings/list`,
  GET_OCCURRENCE_DATA: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${occurrenceId}`,
  EDIT_OCCURRENCE_INFO: (meetingId: string, meetingOccurrenceId: string) =>
    `api/mjalis/meetings/${meetingId}/occurrences/${meetingOccurrenceId}`,
  DELETE_MINUTES_DOCUMENTS: (meetingOccurrenceId: string) =>
    `api/mjalis/meetings/occurrences/${meetingOccurrenceId}/record`,
  DELETE_MANUAL_UPLOADED_MINUTES: (recordId: string) =>
    `api/mjalis/meetings/occurrences/delete-record/${recordId}`,
  EXPORT_OCCURRENCE: (occurrenceId: string) =>
    `api/mjalis/meetings/occurrences/export/${occurrenceId}`,
} as const;

export const MAIN_STORAGE_API = {
  STORAGE_ATTACHMENTS: 'storage/attachment',
  STORAGE_FILE_STREAM: (id: string, accessToken: string) =>
    `storage/attachment/stream/${id}?access_token=${accessToken}`,
  STORAGE_FILE_DOWNLOAD: (
    id: string,
    isDraft: boolean,
    isTenantLogo: boolean,
    accessToken: string
  ) =>
    `storage/attachment/download/${id}?isDraft=${isDraft}&isTenantLogo=${isTenantLogo}&access_token=${accessToken}`,
} as const;

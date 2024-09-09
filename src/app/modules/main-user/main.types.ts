import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Attachments } from '../../core/services/media.service';
import { MeetingStatus } from '../../shared/components/business/meeting-item/meeting-item.component';
import { RepetitionTypes } from './features/meeting/components/repetition-dialog/repetition-dialog-config';

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
};
export type weekDays = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];
export type Member = {
  id: string;
  name: string;
  nameAr: string;
  department?: string;
  departmentAr?: string;
  username: string;
  email: string;
  phone: string;
  ruleId?: string;
  ruleNameEn?: string;
  ruleNameAr?: string;
  memberType: MemberType.internal | MemberType.external;
};

export enum MemberType {
  internal = 'INTERNAL',
  external = 'EXTERNAL',
}

export enum EntityType {
  employee = 0,
  department = 1,
}
export type meetingStatus =
  | 'Draft'
  | 'InProgress'
  | 'Finished'
  | 'Cancelled'
  | 'Planned';
export type Rule = {
  id: string;
  nameEn: string;
  nameAr: string;
};

export type Committee = {
  id: string;
  name: string;
  creationTime: string;
  internalMembers: Member[];
  externalMembers: Member[];
  canDelete: boolean;
};
export type InviteeMember = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  username: string | null;
  type: 'Internal' | 'External';
};
export type Invitee = {
  id: string;
  member: InviteeMember;
};

export type MeetingTopic = {
  id: string;
  title: string;
  requireVoting: boolean;
  attachments: Attachments[];
  choiceName: boolean;
  otherChoice: boolean;
  choices: {
    id: string;
    title: string;
  }[];
};
export type Meeting = {
  id: string;
  title: string;
  status: MeetingStatus;
  date: string;
  endAt: string;
  location: string;
  description: string;
  votingStartType: string;
  votingEndType: string;
  votingStartsAt: string;
  showVotingForAll: boolean;
  smsNotification: boolean;
  emailNotification: boolean;
  meetingId: string;
  repetition: null | any;
  meetingAttachments: Attachments[];
  invitees: Invitee[];
  topics: MeetingTopic[];

  canEditTopics: boolean;
};

export type repeatitionDialogData = {
  type: string;
  typeCount: number;
  weekDays: Partial<weekDays>;
  endAt: string | null;
  expireDate: string;
  day: string | null;
  maxRepetitionCount: number | null;
  end: 'never' | 'date' | 'count';
  isCustom: boolean;
};

export type CreateMeetingServerResponse = {
  result: null;
  value: {
    date: string;
    description: null | string;
    id: string;
    location: null | string;
    meetingAttachments: any;
    meetingId: string;
    notificationType: any;
    showVotingForAll: boolean;
    status: meetingStatus;
    title: null | string;
    votingStartType: string;
    votingEndType: string;
    votingStartsAt: string;
  };
};

export type CommitteeMeetingsList = {
  totalCount: number;
  items: Meeting[];
};
export type CommitteeSingleMeeting = {
  result: any;
  value: Meeting;
};

export type AjendaForm = FormGroup<{
  votingStartType: FormControl<string>;
  votingEndType: FormControl<string>;
  votingStartsAt: FormControl<string>;
  votingStartsAtTime: FormControl<string>;
  showVotingForAll: FormControl<boolean>;
  topics: FormArray<
    FormGroup<{
      id: FormControl<string | null>;
      title: FormControl<string>;
      attachments: FormControl<{ name: string; url: string | File }[]>;
      choices: FormControl<{ id?: string; title: string }[]>;
      otherChoice: FormControl<boolean>;
      choiceName: FormControl<string>;
      active: FormControl<boolean>;
    }>
  >;
}>;
export type MeetingForm = FormGroup<{
  info: FormGroup<{
    name: FormControl<string | null>;
    date: FormControl<null>;
    time: FormControl<null>;
    repeat: FormControl<string | null>;
    invitees: FormControl<null>;
    location: FormControl<string>;
    emailAlert: FormControl<boolean>;
    smsAlert: FormControl<boolean>;
    description: FormControl<string>;
    files: FormControl<FileList>;
  }>;
  ajenda: AjendaForm;
}>;

export type MinuteInvitee = {
  inviteeId: string;
  memberId: string;
  isAttended: boolean;
  name: string;
  email: string;
};
export type MeetingMinuteData = {
  meetingOccurrenceId: string;
  recordText: null | string;
  title: string;
  date: string;
  endAt: string;
  status: 'Draft' | 'Closed';
  attendanceSheetUrl: null | string;
  attendanceSheetType: null | string;
  attendanceSheetName: null | string;
  invitees: MinuteInvitee[];
  attachments: { title: string; url: string; type: string }[];
  recordPdfUrl: null | string;
  isClosed: boolean;
  hasTopics: boolean;
  meetingOccurrenceStatus: meetingStatus;
  topics: MeetingTopic[];
  committeeChairman: string;
  committeeName: string;
  creationTime: string;
};

export type Occurrence = {
  result: unknown;
  value: {
    id: string;
    title: string;
    description: string;
    date: string;
    endAt: string;
    status: meetingStatus;
    votingStartType: null | string;
    votingStartsAt: null | string;
    votingEndType: null | string;
    showVotingForAll: boolean;
    location: string;
    smsNotification: boolean;
    creatorId: string;
    emailNotification: boolean;
    canDelete: boolean;
    canEditTopics: boolean;
    meetingId: string;
    repetition: {
      type: RepetitionTypes;
      isCustom: boolean;
      typeCount: number;
      weekDays: Partial<weekDays>;
      maxRepetitionCount: number;
      endAt: null | string;
      day: null | string;
    };
    meetingAttachments: Attachments[];
    topics: any[];
    invitees: Invitee[];
  };
};

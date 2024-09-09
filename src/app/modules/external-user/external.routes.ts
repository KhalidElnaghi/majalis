import { Routes } from '@angular/router';

import {
  previousMeetingMinutesResolver,
  confirmAttendanceResolver,
  cancelAttendanceResolver,
  meetingPollsResolver,
  myMeetingsResolver,
} from './external.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'meeting-polls', pathMatch: 'full' },
  {
    path: 'meeting-vote',
    title: 'Meeting vote',
    loadComponent: () => import('./pages/meeting-vote/meeting-vote.component'),
    resolve: {
      polls: meetingPollsResolver,
    },
  },
  {
    path: 'vote-success',
    title: 'vote success',
    loadComponent: () =>
      import('./pages/voted-success/voted-success.component'),
  },
  {
    path: 'confirm-attendance',
    title: 'confirm attendance',
    loadComponent: () =>
      import('./pages/confirm-attendance/confirm-attendance.component'),
    resolve: {
      confirmAttendance: confirmAttendanceResolver,
    },
  },
  {
    path: 'cancel-attendance',
    title: 'Cancel attendance',
    loadComponent: () =>
      import('./pages/cancel-attendance/cancel-attendance.component'),
    resolve: {
      cancelAttendance: cancelAttendanceResolver,
    },
  },
  {
    path: 'previous-meeting-minutes',
    title: 'Previous meeting minutes',
    loadComponent: () =>
      import(
        './pages/my-meetings-and-previous-meeting-minutes/my-meetings-and-previous-meeting-minutes.component'
      ),
    resolve: {
      previousMeetingMinutes: previousMeetingMinutesResolver,
      myMeetings: myMeetingsResolver,
    },
  },
  {
    path: 'vote-user-check',
    title: 'Check valid user',
    loadComponent: () =>
      import('./pages/vote-user-check/vote-user-check.component'),
  },
  {
    path: 'vote-otp-check',
    title: 'check valid OTP',
    loadComponent: () =>
      import('./pages/vote-otp-check/vote-otp-check.component'),
  },
];

export default routes;

export const externalRoutes = {
  MEETING_VOTE: '/external/meeting-vote',
  MEETING_VOTE_SUCCESS: '/external/vote-success',
  MEETING_ATTENDANCE_CONFIRM: '/external/confirm-attendance',
  MEETING_ATTENDANCE_CANCEL: '/external/cancel-attendance',
  MEETING_VOTE_USER_CHECK: '/external/vote-user-check',
  MEETING_VOTE_OTP_CHECK: '/external/vote-otp-check',
} as const;

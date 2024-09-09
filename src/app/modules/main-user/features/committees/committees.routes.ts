import { Routes } from '@angular/router';

import { occurrenceStepperDataResolver } from '../meeting/pages/edit-occurrence-stepper/edit-edoccurrence-stepper.config';
import {
  permissionsResolver,
  scopedPermissionsResolver,
} from '../../../../core/permissions/permissions.resolver';
import { meetingStepInfoResolver } from '../meeting/components/meeting-info-step/meeting-info-step.config';
import { meetingMinuteResolver } from '../meeting/pages/meeting-minute/meeting-minute.config';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    title: 'Committee list',
    loadComponent: () =>
      import('./pages/committee-list/committee-list.component'),
    resolve: { permissions: permissionsResolver },
  },
  {
    path: 'details',
    title: 'Committee Details',
    loadComponent: () =>
      import('./pages/committee-details/committee-details.component'),
    resolve: { committeePermissions: scopedPermissionsResolver },
  },
  {
    path: 'meeting',
    title: 'Meeting Form',
    resolve: {
      details: meetingStepInfoResolver,
    },
    loadComponent: () =>
      import('../meeting/pages/meeting-stepper/meeting-stepper.component'),
  },
  {
    path: 'meeting-minute',
    title: 'Meeting Minute',
    resolve: {
      meetingMinuteData: meetingMinuteResolver,
    },
    loadComponent: () =>
      import('../meeting/pages/meeting-minute/meeting-minute.component'),
  },
  {
    path: 'edit-occurrence',
    title: 'Edit Occurrence',
    resolve: {
      occurrenceData: occurrenceStepperDataResolver,
    },
    loadComponent: () =>
      import(
        '../meeting/pages/edit-occurrence-stepper/edit-occurrence-stepper.component'
      ),
  },
];

export default routes;

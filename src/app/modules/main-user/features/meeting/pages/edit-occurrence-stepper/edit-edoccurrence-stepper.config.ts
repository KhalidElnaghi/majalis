import { ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbStructure } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MeetingsService } from '../../meetings.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { Occurrence } from '../../../../main.types';

export const breadcrumbData = (committeeId: string): BreadcrumbStructure => [
  { path: '/main', title: 'MAIN.TITLE.COMMITTEES', icon: 'corporate_fare' },
  {
    path: `/main/committee/details`,
    queryParams: {
      committeeId: committeeId,
    },
    title: 'MAIN.LABEL.COMMITTEE_DETAILS',
  },
  { title: 'MAIN.TITLE.MEETING_CREATE' },
];

export const pageTitle = {
  title: 'MAIN.TITLE.EDIT_MEETING',
  subTitle: '',
};

export const occurrenceStepperDataResolver = (
  route: ActivatedRouteSnapshot
): Observable<Occurrence> => {
  const { occurrenceId } = route.queryParams;
  const meetingService = inject(MeetingsService);

  const messages = inject(MessagesService);
  return meetingService.getOccurrenceData(occurrenceId).pipe(
    catchError((error) => {
      messages.show('error', error.message);
      return throwError(() => error);
    })
  );
};

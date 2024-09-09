import { ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbStructure } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { MeetingsService } from '../../meetings.service';

export const breadcrumbData = (committeeId: string): BreadcrumbStructure => [
  { path: '/main', title: 'MAIN.TITLE.COMMITTEES', icon: 'corporate_fare' },
  {
    path: `/main/committee/details`,
    queryParams: {
      committeeId: committeeId,
    },
    title: 'MAIN.LABEL.COMMITTEE_DETAILS',
  },
  { title: 'MAIN.LABEL.MEETING_MINUTE' },
];

export const pageTitle = {
  title: 'MAIN.LABEL.MEETING_MINUTE',
  subTitle: '',
};

export function meetingMinuteResolver(
  route: ActivatedRouteSnapshot
): Observable<unknown> {
  const { occurrenceId } = route.queryParams;
  const meetingService = inject(MeetingsService);

  const messages = inject(MessagesService);

  return meetingService.getMeetingMinute(occurrenceId).pipe(
    catchError((error) => {
      messages.show('error', error.message);
      return throwError(() => error);
    })
  );
}

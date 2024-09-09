import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { MessagesService } from '../../shared/components/ui/snackbars/messages.service';
import { ExternalService } from './external.service';

// #region Resolvers
export const meetingPollsResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { secret, withOTP } = route.queryParams;
  const externalService = inject(ExternalService);
  const messageService = inject(MessagesService);

  if (withOTP) {
    return externalService.getPollsByOtp(secret).pipe(
      catchError((error) => {
        messageService.show('error', error.message);
        return throwError(() => error);
      })
    );
  } else {
    return externalService.getPolls(secret).pipe(
      catchError((error) => {
        messageService.show('error', error.message);
        return throwError(() => error);
      })
    );
  }
};

export const confirmAttendanceResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { secret } = route.queryParams;
  const externalService = inject(ExternalService);
  const messageService = inject(MessagesService);

  return externalService.sendAttendance(secret, true).pipe(
    catchError((error) => {
      messageService.show('error', error.message);
      return throwError(() => error);
    })
  );
};

export const cancelAttendanceResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { secret } = route.queryParams;
  const externalService = inject(ExternalService);
  const messageService = inject(MessagesService);

  return externalService.sendAttendance(secret, false).pipe(
    catchError((error) => {
      messageService.show('error', error.message);
      return throwError(() => error);
    })
  );
};

export const previousMeetingMinutesResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { secret } = route.queryParams;
  const externalService = inject(ExternalService);
  const messageService = inject(MessagesService);

  return externalService.getPreviousMeetingMinutes(secret).pipe(
    catchError((error) => {
      messageService.show('error', error.message);
      return throwError(() => error);
    })
  );
};

export const myMeetingsResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { secret } = route.queryParams;
  const externalService = inject(ExternalService);
  const messageService = inject(MessagesService);

  return externalService.getMyMeetings(secret).pipe(
    catchError((error) => {
      messageService.show('error', error.message);
      return throwError(() => error);
    })
  );
};

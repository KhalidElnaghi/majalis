import { inject } from '@angular/core';

import { catchError, tap, throwError } from 'rxjs';

import { MessagesService } from '../../shared/components/ui/snackbars/messages.service';
import { PermissionsManagerService } from './permissions-manager.service';
import { ActivatedRouteSnapshot } from '@angular/router';

export const permissionsResolver = () => {
  const permissionsService = inject(PermissionsManagerService);
  const messages = inject(MessagesService);

  return permissionsService.getUserNonScopedPermissions().pipe(
    catchError((error) => {
      messages.show('error', error.message);
      return throwError(() => error);
    })
  );
};

export const scopedPermissionsResolver = (route: ActivatedRouteSnapshot) => {
  const permissionsService = inject(PermissionsManagerService);
  const messages = inject(MessagesService);

  const { committeeId } = route.queryParams;

  return permissionsService.getUserScopedPermissions(committeeId).pipe(
    catchError((error) => {
      messages.show('error', error.message);
      return throwError(() => error);
    })
  );
};

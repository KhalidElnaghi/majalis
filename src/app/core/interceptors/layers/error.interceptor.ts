import { Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { EMPTY, catchError, throwError } from 'rxjs';

import { MessagesService } from '../../../shared/components/ui/snackbars/messages.service';
import { authRoutes } from '../../../modules/auth/auth.routes';
import { LayoutService } from '../../services/layout.service';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const translateService = inject(TranslateService);
  const messagesService = inject(MessagesService);
  const layoutService = inject(LayoutService);
  const router = inject(Router);

  const commonErrorStatus = new Set([500, 503, 404]);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const backendError = error.error as MjalesErrorResponse;

      if (error.status !== 0) {
        if (error.status == 401) {
          messagesService.show(
            'error',
            'Authentication failed, Invalid token!'
          );
          router.navigate([authRoutes.LOGOUT]);
          return EMPTY;
        }

        if (commonErrorStatus.has(error.status)) {
          const errorMessage = translateService.instant(
            commonErrorMessages.get(error.status.toString()) as string
          );
          layoutService.isLoading.set(false);
          messagesService.show('error', errorMessage);

          return EMPTY;
        } else {
          return throwError(() => backendError.error);
        }
      }
      return EMPTY;
    })
  );
};

const commonErrorMessages = new Map([
  ['404', 'Requested URL is not found'],
  ['500', 'Internal Server Error'],
  ['503', 'Service is not available'],
]);

type MjalesErrorResponse = {
  error: {
    code: number | string;
    message: string;
    details: unknown;
    data: unknown;
    validationErrors: unknown;
  };
};

import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

import { MessagesService } from '../../../shared/components/ui/snackbars/messages.service';

export const networkInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const translation = inject(TranslateService);
  const messages = inject(MessagesService);

  if (!window.navigator.onLine) {
    const errorMessage = translation.instant(
      'GLOBAL.ERROR.NO_INTERNET_CONNECTION'
    );
    messages.show('error', errorMessage);
    return throwError(() => errorMessage);
  }
  return next(request);
};

import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

import { AuthenticationService } from '../../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthenticationService);

  const authenticatedRequest = request.clone({
    headers: request.headers.set(
      'Authorization',
      `Bearer ${authService.accessToken}`
    ),
  });

  return next(authenticatedRequest);
};

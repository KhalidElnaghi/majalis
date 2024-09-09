import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { LayoutService } from '../../services/layout.service';

export const httpInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const currentLang = inject(LayoutService).language;
  const baseURL = environment.baseUrl;

  if (request.url.startsWith('http')) {
    return next(request);
  }

  let modifiedRequset = request.clone({
    url: `${baseURL}${request.url}`,
    setHeaders: {
      'Accept-Language': currentLang(),
    },
  });

  return next(modifiedRequset);
};

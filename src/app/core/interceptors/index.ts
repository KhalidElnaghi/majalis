import { HttpInterceptorFn } from '@angular/common/http';

import { networkInterceptor } from './layers/network.interceptor';
import { errorInterceptor } from './layers/error.interceptor';
import { authInterceptor } from './layers/auth.interceptor';
import { httpInterceptor } from './layers/http.interceptor';

export const interceptors: HttpInterceptorFn[] = [
  networkInterceptor,
  authInterceptor,
  httpInterceptor,
  errorInterceptor,
];

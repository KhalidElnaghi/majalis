import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';

import { authRoutes } from '../../modules/auth/auth.routes';

import { MessagesService } from '../../shared/components/ui/snackbars/messages.service';
import { mainRoutes } from '../../modules/main-user/main.routes';

export const mainModulesAuthGuard: CanActivateFn = () => {
  const oAuthService = inject(OAuthService);
  const messages = inject(MessagesService);
  const router = inject(Router);

  if (!oAuthService.hasValidAccessToken()) {
    messages.show('error', 'Authentication failed, Invalid token!');
    router.navigate([authRoutes.LOGIN]);
    return false;
  }
  return true;
};

export const authGuard: CanActivateFn = () => {
  const oAuthService = inject(OAuthService);
  const router = inject(Router);

  if (oAuthService.hasValidIdToken()) {
    router.navigate([mainRoutes.COMMITTEE]);
    return false;
  }

  return true;
};

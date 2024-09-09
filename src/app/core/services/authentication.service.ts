import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { fromEvent } from 'rxjs';

import { MessagesService } from '../../shared/components/ui/snackbars/messages.service';
import { BrowserStorageService } from './browser-storage.service';

import { mainRoutes } from '../../modules/main-user/main.routes';
import { authRoutes } from '../../modules/auth/auth.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private browserStorageService = inject(BrowserStorageService);
  private oAuthService = inject(OAuthService);
  private messages = inject(MessagesService);
  private router = inject(Router);
  private zone = inject(NgZone);

  ROUTERS = mainRoutes;

  // #region Methods
  login() {
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.tryLoginCodeFlow().then(() => {
      if (this.isLoggedIn) {
        this.router.navigate([this.ROUTERS.COMMITTEE]);
      } else {
        this.oAuthService.initLoginFlow();
      }
    });
  }

  logout() {
    this.oAuthService.logOut();
    this.browserStorageService.clearAllData();
  }

  get isLoggedIn() {
    return this.oAuthService.hasValidAccessToken();
  }

  get userData() {
    return this.oAuthService.getIdentityClaims();
  }

  get accessToken() {
    return this.oAuthService.getAccessToken();
  }

  // NOTE: This check is for the user having two open tabs and logout from one of them,
  //  This other tab when activated should also act as for logged out user.
  checkActiveTab() {
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          let visibilityState = (res.target as Document).visibilityState;
          if (visibilityState == 'visible') {
            if (!this.isLoggedIn) {
              this.messages.show(
                'error',
                'Authentication failed, Invalid token!'
              );
              this.zone.run(() => this.router.navigate([authRoutes.LOGIN]));
            }
          }
        },
        error: () => this.messages.show('error', 'Something went wrong!'),
      });
  }
}

export type userData = {
  ArabicName: string;
  EnglishName: string;
  'AspNet.Identity.SecurityStamp': string;
  MainDepartment: string;
  UserType: string;
  amr: string[];
  at_hash: string;
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  iat: number;
  idp: string;
  iss: string;
  location: string;
  'login-name': string;
  name: string[];
  nbf: number;
  nonce: string;
  preferred_username: string;
  s_hash: string;
  sid: string;
  sub: string;
  tenantid: string;
  website: string;
};

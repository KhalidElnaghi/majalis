import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  provideHttpClient,
  withInterceptors,
  HttpBackend,
} from '@angular/common/http';
import {
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
  withRouterConfig,
  provideRouter,
} from '@angular/router';

import { MatPaginatorIntl } from '@angular/material/paginator';

import { environment } from '../environments/environment';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  provideOAuthClient,
  OAuthStorage,
  AuthConfig,
} from 'angular-oauth2-oidc';

import { interceptors } from './core/interceptors';
import { routes } from './app.routes';

import { CustomMatPaginatorIntl } from './shared/components/ui/data-table/custom-paginator-intl.service';
import {
  MultiTranslateLoader,
  LANG,
} from './core/services/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),

    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withComponentInputBinding(),
      withViewTransitions()
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: LANG.AR,
        loader: {
          provide: TranslateLoader,
          useFactory: MultiTranslateLoader,
          deps: [HttpBackend],
        },
      })
    ),

    DatePipe,
    // NOTE: Ole5 auth service integration config
    provideOAuthClient(),
    { provide: AuthConfig, useValue: environment.oAuthConfig },
    { provide: OAuthStorage, useValue: localStorage },

    // Material Custom Providers
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
};

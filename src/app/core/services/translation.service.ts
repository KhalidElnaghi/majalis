import { Injectable, inject } from '@angular/core';
import { HttpBackend } from '@angular/common/http';

import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { TranslateService } from '@ngx-translate/core';

export const MultiTranslateLoader = (
  http: HttpBackend
): MultiTranslateHttpLoader =>
  new MultiTranslateHttpLoader(http, [
    './assets/i18n/external/',
    './assets/i18n/main/',
    './assets/i18n/',
  ]);

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translateService = inject(TranslateService);

  private languages = [LANG.EN, LANG.AR];

  constructor() {
    this.translateService.addLangs(this.languages);
  }

  useLanguage(language: LANG) {
    this.translateService.use(language);
  }
}

export enum LANG {
  AR = 'ar',
  EN = 'en',
}

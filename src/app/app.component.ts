import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { LANG, TranslationService } from './core/services/translation.service';
import { AuthenticationService } from './core/services/authentication.service';
import { NetworkMonitorService } from './core/services/network-monitor.service';
import { DIR, LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <main
    class="min-h-screen min-w-full transition-all duration-300"
    [dir]="layout.direction()"
  >
    <router-outlet />
  </main>`,
})
export class AppComponent {
  private networkConnectivity = inject(NetworkMonitorService);
  private authService = inject(AuthenticationService);

  private translation = inject(TranslationService);
  private translate = inject(TranslateService);
  layout = inject(LayoutService);

  constructor() {
    this.authService.checkActiveTab();
  }

  ngOnInit(): void {
    this.translation.useLanguage(
      localStorage.getItem('language') === LANG.EN ? LANG.EN : LANG.AR
    );

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.layout.direction.set(event.lang === LANG.AR ? DIR.RTL : DIR.LTR);
      this.layout.language.set(event.lang as LANG);
    });
  }
}

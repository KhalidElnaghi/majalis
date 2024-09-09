import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DIR, LayoutService } from '../../../../core/services/layout.service';
import {
  TranslationService,
  LANG,
} from '../../../../core/services/translation.service';

@Component({
  selector: 'language-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <button
    class="!rounded-3xl"
    (click)="changeLanguage()"
    mat-stroked-button
    color="primary"
    disableRipple
  >
    <span>
      {{ layout.direction() == direction.RTL ? 'English' : 'العربية' }}
    </span>
    <mat-icon class="text-primary">translate</mat-icon>
  </button>`,
})
export class LanguageToggleComponent {
  translation = inject(TranslationService);
  layout = inject(LayoutService);
  direction = DIR;

  changeLanguage() {
    this.translation.useLanguage(
      localStorage.getItem('language') === LANG.AR ? LANG.EN : LANG.AR
    );
    localStorage.setItem(
      'language',
      localStorage.getItem('language') === LANG.AR ? LANG.EN : LANG.AR
    );
  }
}

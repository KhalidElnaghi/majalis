import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Injectable, inject, signal } from '@angular/core';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Direction } from '@angular/cdk/bidi';

import { LANG } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private mediaObserver = inject(BreakpointObserver);

  isMenuOpen = signal<boolean>(true);
  isLoading = signal<boolean>(false);

  language = signal<LANG>(LANG.EN);

  direction = signal<Direction>(DIR.RTL);
  onMobile = signal<boolean>(false);
  onTablet = signal<boolean>(false);

  constructor() {
    this.mediaObserver
      .observe(screenSize.MAX_W_40)
      .pipe(takeUntilDestroyed())
      .subscribe((res: BreakpointState) => {
        if (res.matches) {
          this.onMobile.set(true);
        } else {
          this.onMobile.set(false);
        }
      });

    this.mediaObserver
      .observe([screenSize.MAX_W_64, screenSize.MIN_W_40])
      .pipe(takeUntilDestroyed())
      .subscribe((res: BreakpointState) => {
        if (
          res.breakpoints[screenSize.MAX_W_64] &&
          res.breakpoints[screenSize.MIN_W_40]
        ) {
          this.onTablet.set(true);
        } else {
          this.onTablet.set(false);
        }
      });

    this.mediaObserver
      .observe([screenSize.MAX_W_64])
      .pipe(takeUntilDestroyed())
      .subscribe((res: BreakpointState) => {
        if (res.matches) {
          this.isMenuOpen.set(false);
        } else {
          this.isMenuOpen.set(true);
        }
      });
  }
}

export enum DIR {
  LTR = 'ltr',
  RTL = 'rtl',
}

enum screenSize {
  MAX_W_40 = '(max-width: 40rem)',
  MIN_W_40 = '(min-width: 40rem)',
  MAX_W_64 = '(max-width: 64rem)',
}

import { Component, inject, input } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ProfileActionsMenuComponent } from '../../business/profile-actions-menu/profile-actions-menu.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

import { LayoutService } from '../../../../core/services/layout.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'top-bar',
  standalone: true,
  imports: [
    RouterLink,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,

    LanguageToggleComponent,
    ProfileActionsMenuComponent,
    MatProgressBar,
  ],
  template: `
    <mat-toolbar
      class="flex justify-between items-center shadow-md relative z-[10] transition-colors backdrop-blur-md"
    >
      <div
        class="flex gap-8 items-center justify-between mx-2 sm:w-fit md:w-72"
      >
        <div [routerLink]="DASHBOARD_ROUTE" class="flex-1">
          <img
            src="./assets/images/ole5.png"
            alt="Logo"
            class="cursor-pointer w-20 mx-auto"
          />
        </div>

        @if(!isNotFound()){
        <button (click)="collabseMenu()" mat-icon-button>
          <mat-icon>menu</mat-icon>
        </button>
        }
      </div>

      <div class="flex items-center">
        @if(!isNotFound()){
        <language-toggle />
        }

        <profile-actions-menu />
      </div>
    </mat-toolbar>
    @if(layout.isLoading()) {
    <mat-progress-bar mode="indeterminate" />
    }
  `,
})
export class TopBarComponent {
  protected layout = inject(LayoutService);

  isNotFound = input<boolean>(false);

  DASHBOARD_ROUTE = '/main';

  collabseMenu() {
    this.layout.isMenuOpen.set(!this.layout.isMenuOpen());
  }
}

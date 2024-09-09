import { Component, inject, signal } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import {
  AuthenticationService,
  userData,
} from '../../../../core/services/authentication.service';

import { authRoutes as ROUTES } from '../../../../modules/auth/auth.routes';

@Component({
  selector: 'profile-actions-menu',
  standalone: true,
  imports: [
    RouterLink,

    MatTooltipModule,
    MatMenuModule,
    MatIconButton,
    MatDivider,
    MatIcon,

    TranslateModule,
  ],
  template: `
    <button
      class="!bg-light !shadow-inner !mx-2"
      [matTooltip]="'GLOBAL.LABEL.USER_PROFILE' | translate"
      [matMenuTriggerFor]="profile_menu"
      matTooltipPosition="below"
      mat-icon-button
    >
      <mat-icon class="!text-base !font-medium !font-cairo">
        {{ userInformation().nameLetters }}
      </mat-icon>
    </button>

    <mat-menu class="!rounded-lg !mt-2 !min-w-56" #profile_menu="matMenu">
      <div class="my-2 flex flex-col items-center gap-2 justify-around">
        <div class="text-center">
          <h2 class="font-medium text-gray-500 text-base">
            {{ userInformation().userName }}
          </h2>

          <span class="text-gray-500/70 text-xs">
            {{ userInformation().userDepartment }}
          </span>
        </div>
      </div>

      <mat-divider class="!my-1" />

      <div class="px-1 text-center">
        <button mat-menu-item>
          <mat-icon fontSet="material-icons-outlined">person</mat-icon>
          <span class="text-gray-500 text-xs">{{
            'GLOBAL.LABEL.USER_PROFILE' | translate
          }}</span>
        </button>

        <button mat-menu-item>
          <mat-icon fontSet="material-icons-outlined">settings</mat-icon>
          <span class="text-gray-500 text-xs">
            {{ 'GLOBAL.LABEL.SETTINGS' | translate }}
          </span>
        </button>

        <mat-divider class="!my-1" />

        <button mat-menu-item [routerLink]="authRoutes.LOGOUT">
          <mat-icon>logout</mat-icon>
          <span class="text-gray-500 text-xs">
            {{ 'GLOBAL.LABEL.LOGOUT' | translate }}
          </span>
        </button>
      </div>
    </mat-menu>
  `,
})
export class ProfileActionsMenuComponent {
  authService = inject(AuthenticationService);

  authRoutes = ROUTES;

  userInformation = signal<ProfileInfo>({
    userName: '',
    userDepartment: '',
    nameLetters: '',
  });

  ngOnInit(): void {
    const tokenData: Partial<userData> = this.authService.userData;

    this.userInformation.set({
      userName: tokenData.EnglishName || 'Nour Joudeh',
      userDepartment: tokenData.aud || 'Main Department', // TODO: need the department name to be in the response.
      nameLetters: this.getNameLetters(tokenData.EnglishName || 'Nour Joudeh'),
    });
  }

  private getNameLetters(name: string) {
    return name
      .split(' ')
      .map((name) => name[0].toUpperCase())
      .join('')
      .slice(0, 2);
  }
}

type ProfileInfo = {
  userName: string;
  userDepartment: string;
  nameLetters: string;
};

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

import { TranslateModule } from '@ngx-translate/core';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'logout',
  standalone: true,
  imports: [MatButton, MatCardModule, TranslateModule, MatProgressBar],
  template: ` <div class="flex items-center justify-center h-full">
    <mat-card class="!rounded-2xl overflow-hidden">
      <mat-progress-bar mode="indeterminate" />

      <mat-card-header class="flex items-center justify-center mb-4">
        <mat-card-title class="text-center !text-4xl">
          {{ 'Redirect Logout' | translate }}
        </mat-card-title>

        <mat-card-subtitle class="text-center !text-2xl">
          {{ 'Mjales' | translate }}
        </mat-card-subtitle>
      </mat-card-header>

      <img src="./assets/images/logout.svg" alt="Login" width="100%" />
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogoutComponent {
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    this.authService.logout();
  }
}

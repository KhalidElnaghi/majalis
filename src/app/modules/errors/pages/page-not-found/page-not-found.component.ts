import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatCard, MatCardActions, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { TopBarComponent } from '../../../../shared/components/ui/top-bar/top-bar.component';

import { TranslateModule } from '@ngx-translate/core';

import { mainRoutes } from '../../../main-user/main.routes';

@Component({
  selector: 'page-not-found',
  standalone: true,
  imports: [
    MatCardActions,
    MatCardImage,
    MatButton,
    RouterLink,
    MatCard,

    TranslateModule,

    TopBarComponent,
  ],
  template: `
    <div class="bg-light h-[100vh]">
      <top-bar [isNotFound]="true" />

      <div>
        <mat-card class="!rounded-2xl sm:w-full md:w-1/2 mx-auto p-2 mt-8">
          <img
            mat-card-image
            src="./assets/images/page_not_found.svg"
            alt="Not Found"
            width="100%"
          />

          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              [routerLink]="ROUTES.COMMITTEE"
            >
              {{ 'MAIN.LABEL.HOME_PAGE' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageNotFoundComponent {
  ROUTES = mainRoutes;
}

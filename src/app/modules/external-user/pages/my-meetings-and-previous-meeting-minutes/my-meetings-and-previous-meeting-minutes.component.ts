import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { MatTabsModule } from '@angular/material/tabs';

import { AttachmentCardComponent } from '../../../../shared/components/ui/attachment-card/attachment-card.component';
import MyMeetingsListComponent from '../../components/my-meetings-list/my-meetings-list.component';

import { Meeting } from '../../../main-user/main.types';

export type MyMeeting = {
  totalCount: number;
  items: Meeting[];
};
@Component({
  selector: 'external-previous-meeting-minutes-and-meetings',
  standalone: true,
  imports: [
    TranslateModule,
    MatTabsModule,
    MyMeetingsListComponent,
    AttachmentCardComponent,
  ],

  template: `
    <mat-tab-group
      animationDuration="0ms"
      mat-stretch-tabs="false"
      mat-align-tabs="start"
    >
      <mat-tab [label]="'MAIN.TITLE.PAST_MEETINGS_MINUTES' | translate">
        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mt-4"
        >
          @for(item of this.previousMeetingMinutes; track item) {
          <attachment-card [fileData]="item" />
          }
        </div>
      </mat-tab>

      <mat-tab [label]="'MAIN.TITLE.MY_MEETINGS_LIST' | translate">
        <div class="mt-4">
          <my-meetings-list />
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export default class ExternalUserComponent {
  activatedRoute = inject(ActivatedRoute);

  previousMeetingMinutes: any[] =
    this.activatedRoute.snapshot.data['previousMeetingMinutes'];
}

import { DomSanitizer } from '@angular/platform-browser';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';

import { PollsResultDialogComponent } from '../../../main-user/features/meeting/components/polls-result-dialog/polls-result-dialog.component';
import { AttachmentChipComponent } from '../../../../shared/components/ui/attachment-chip/attachment-chip.component';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { ExternalService } from '../../external.service';

import { CustomDatePipe } from '../../../../shared/pipes/custom-date-pipe/custom-date-pipe.pipe';
import { ExternalPollsDialogComponent } from '../polls-result-dialog/external-polls-dialog.component';

@Component({
  selector: 'meeting-details-dialog',
  standalone: true,
  imports: [
    TranslateModule,
    QRCodeModule,

    MatButtonModule,
    MatChip,

    AttachmentChipComponent,
    CustomDatePipe,
  ],
  template: ` <div class="p-4">
    <h3 class="mb-8 mt-4 text-xl font-bold">
      {{ 'MAIN.TITLE.MEETING_PREVIEW' | translate }}
    </h3>
    <div class="grid grid-cols-1 gap-6">
      <!-- Title -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.MEETING_NAME' | translate }}
        </span>

        <p class="font-bold">
          {{ this.dialogData.meeting.title || 'MAIN.LABEL.NONE' | translate }}
        </p>
      </div>

      <!-- Date -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.MEETING_DATE_AND_TIME' | translate }}
        </span>

        <p class="font-bold">
          {{ this.dialogData.meeting.date | customDatePipe : 'dd-MM-yyyy' }}
          <span class="mx-2">-</span>
          {{ this.dialogData.meeting.date | customDatePipe : 'hh:mm a' }}
        </p>
      </div>

      <!-- Invitees -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.INVITEES' | translate }}
        </span>

        <div class="flex gap-2 flex-wrap">
          @if(this.dialogData.meeting.invitees?.length){

          <!-- LOOP OVER INVITEESS -->
          @for (invitee of this.dialogData.meeting.invitees; track invitee) {
          <mat-chip class="!bg-white !border !border-primary !rounded-full">
            <span class="text-primary">{{ invitee.member.name }}</span>
          </mat-chip>
          }

          <!-- Show "None" -->
          } @else {
          <p class="font-bold">
            {{ 'MAIN.LABEL.NONE' | translate }}
          </p>
          }
        </div>
      </div>

      <!-- Location -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.LOCATION' | translate }}
        </span>

        @if(this.dialogData.meeting.location) {
        <p class="font-bold">{{ this.dialogData.meeting.location }}</p>
        }@else {
        <p class="font-bold">
          {{ 'MAIN.LABEL.NONE' | translate }}
        </p>
        }
      </div>

      <!-- Notifications -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.ALERT_TYPE' | translate }}
        </span>

        <div>
          @if (this.dialogData.meeting.emailNotification) {
          <p class="font-bold mb-1">{{ 'MAIN.LABEL.EMAIL' | translate }}</p>
          }
          <!--  -->
          @if(this.dialogData.meeting.smsNotification) {
          <p class="font-bold mb-1">{{ 'MAIN.LABEL.SMS' | translate }}</p>
          }
          <!--  -->
          @if (!this.dialogData.meeting.smsNotification &&
          !this.dialogData.meeting.emailNotification) {
          <p class="font-bold">{{ 'MAIN.LABEL.NONE' | translate }}</p>
          }
        </div>
      </div>

      <!-- Description -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.DESCRIPTION' | translate }}
        </span>

        <p class="font-bold">
          {{
            this.dialogData.meeting.description || 'MAIN.LABEL.NONE' | translate
          }}
        </p>
      </div>

      @if( this.dialogData.meeting.topics.length){
      <!-- Meeting-Polls -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.TITLE.MEETING_POLLS' | translate }}
        </span>

        <button
          mat-flat-button
          class="!bg-primary !text-white"
          (click)="handleViewMeetingPollResult()"
        >
          {{ 'MAIN.BUTTON.PREVIEW_MEETING_POLLS' | translate }}
        </button>
      </div>

      }

      <!-- Attachments -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.ATTACHMENTS' | translate }}
        </span>
        <div class="flex flex-wrap items-start gap-4">
          <!-- Loop Over Attachments -->
          @for(attachment of dialogData.meeting.meetingAttachments; track
          attachment){
          <attachment-chip [fileData]="attachment" />
          } @empty {
          <p class="font-bold">
            {{ 'MAIN.LABEL.NONE' | translate }}
          </p>
          }
        </div>
      </div>

      <!-- Voting QR Code -->
      <div class="flex flex-col items-start gap-2 md:flex-row">
        <span class="basis-1/5 text-gray-400">
          {{ 'MAIN.LABEL.VOTING_QR_CODE' | translate }}
        </span>

        <qrcode elementType="svg" [qrdata]="voteURL" [width]="200" />
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingDetailsDialogComponent {
  externalUserService = inject(ExternalService);
  authService = inject(AuthenticationService);
  dialogData = inject(MAT_DIALOG_DATA);
  sanitizer = inject(DomSanitizer);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);

  repetitionString = signal<string[]>(['']);

  tenantId = this.authService?.userData?.['tenantid'] || '';

  voteURL = this.externalUserService.voteURL({
    id: this.dialogData.meeting.id,
    title: this.dialogData.meeting.title,
    tenant: this.tenantId,
  });

  handleViewMeetingPollResult() {
    if (this.dialogData.isExternal) {
      this.dialog.open(ExternalPollsDialogComponent, {
        width: '70%',
        maxHeight: '600px',

        direction: this.layout.direction(),
        data: {
          meetingStatus: this.dialogData.meeting.status,
          topics: this.dialogData.meeting?.topics || [],
        },
      });
    } else {
      this.dialog.open(PollsResultDialogComponent, {
        width: '70%',
        maxHeight: '600px',

        direction: this.layout.direction(),
        data: {
          meetingId: this.dialogData.meeting.id,
          showVotingForAll: true,
          meetingStatus: this.dialogData.meeting.status,
        },
      });
    }
  }
}

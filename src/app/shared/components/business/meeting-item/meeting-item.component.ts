import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { PollsResultDialogComponent } from '../../../../modules/main-user/features/meeting/components/polls-result-dialog/polls-result-dialog.component';
import { MeetingDetailsDialogComponent } from '../../../../modules/external-user/components/meeting-details-dialog/meeting-details-dialog.component';
import { StatusChipComponent } from '../../../../modules/main-user/components/status-chip/status-chip.component';

import { PermissionsManagerService } from '../../../../core/permissions/permissions-manager.service';
import { MeetingsService } from '../../../../modules/main-user/features/meeting/meetings.service';
import { DialogsService } from '../../ui/confirm-dialog/confirmation-dialog.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { MessagesService } from '../../ui/snackbars/messages.service';

import { toLocaleTimeZone } from '../../../../modules/main-user/features/meeting/components/meeting-info-step/meeting-info-step.config';
import { urlRegExp } from '../../../../modules/main-user/features/meeting/pages/meeting-stepper/meeting-stepper.config';
import { CustomDatePipe } from '../../../pipes/custom-date-pipe/custom-date-pipe.pipe';
import { Meeting } from '../../../../modules/main-user/main.types';
import {
  Resources,
  Action,
} from '../../../../core/permissions/auth-request.model';
import { ExternalPollsDialogComponent } from '../../../../modules/external-user/components/polls-result-dialog/external-polls-dialog.component';

export type MeetingAction = {
  id: number;
  handleClick: () => void;
  fontIcon: string;
  iconClasses: string;
  tooltip: string;
  filter: MeetingStatus[];
  isActive: boolean;
};

export enum MeetingStatus {
  closed = 'Closed',
  finished = 'Finished',
  inProgress = 'InProgress',
  planned = 'Planned',
  draft = 'Draft',
}

@Component({
  selector: 'meeting-item',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    MatMenuModule,
    MatIconButton,
    MatCheckbox,
    MatTooltip,
    MatButton,
    MatCard,
    MatIcon,
    TranslateModule,
    CustomDatePipe,
    StatusChipComponent,
  ],
  template: `
    <mat-card
      class="!flex !flex-row !items-center !justify-between !p-4 !shadow transition hover:!bg-primary/20 gap-4 !bg-light"
    >
      <div
        class="flex items-center gap-4 !grow !cursor-pointer"
        (click)="viewMeetingDetails()"
      >
        <div class="flex flex-col gap-1">
          <div class="flex item-center gap-4">
            <h3 class="text-black my-0 font-bold text-sm leading-loose">
              {{ meeting().title }}
            </h3>
            <status-chip [status]="meeting().status" />
          </div>

          <p class="text-disabledText text-xs flex gap-2 items-center">
            <span>{{ 'MAIN.LABEL.TIME' | translate }}:</span>

            <span class="flex items-center">
              <span>{{ meetingStartTime() | customDatePipe : 'hh:mm a' }}</span>
              <mat-icon class="!text-xs !flex !items-center !justify-center">{{
                layout.language() === 'en' ? 'east' : 'west'
              }}</mat-icon>
              <span>{{ meetingEndTime() | customDatePipe : 'hh:mm a' }}</span>
            </span>
          </p>

          <p class="text-disabledText text-xs flex gap-1">
            <span>{{ 'MAIN.LABEL.DATE' | translate }}:</span>
            <span>{{ meeting().date | customDatePipe : 'dd-MM-yyyy' }}</span>
          </p>

          <p class="text-disabledText text-xs flex gap-1">
            <span>{{ 'MAIN.LABEL.LOCATION' | translate }}:</span>
            <span [innerHTML]="getSanitizedText()"></span>
          </p>
        </div>
      </div>

      @if(isInternal()){
      <div class="flex items-center gap-1">
        @if (layout.onMobile()) {

        <button mat-icon-button [matMenuTriggerFor]="iconsMenu">
          <mat-icon>more_vert</mat-icon>
        </button>

        <mat-menu #iconsMenu="matMenu">
          @for(action of actions; track action.id) {

          <!-- Show Only Related Buttons According To The Meeting Status -->
          @if(action.isActive && action.filter.includes(meeting().status)){
          <button mat-menu-item (click)="action.handleClick()">
            <mat-icon
              [ngClass]="action.iconClasses"
              [fontIcon]="action.fontIcon"
            >
            </mat-icon>

            <span>{{ action.tooltip | translate }}</span>
          </button>
          } }
        </mat-menu>

        }@else {

        <!-- Actions -->
        @for(action of actions; track action.id) {

        <!-- Show Only Related Buttons According To The Meeting Status -->
        @if(action.isActive && action.filter.includes(meeting().status)){
        <button
          [matTooltip]="action.tooltip | translate"
          (click)="action.handleClick()"
          matTooltipPosition="above"
          mat-icon-button
        >
          <mat-icon
            [ngClass]="action.iconClasses"
            [fontIcon]="action.fontIcon"
          ></mat-icon>
        </button>
        } } }
      </div>
      }

      <!-- For extrnal user module only -->
      @if(!isInternal() && meeting().topics.length ){
      <button
        [matTooltip]="'GLOBAL.BUTTON.MEETING_POLLS' | translate"
        (click)="handleViewMeetingPollResultExternal()"
        matTooltipPosition="above"
        mat-icon-button
      >
        <mat-icon class="!text-status-warning" fontIcon="bar_chart"></mat-icon>
      </button>
      }
    </mat-card>
  `,
})
export class MeetingItemComponent {
  permissionsService = inject(PermissionsManagerService);
  meetingService = inject(MeetingsService);
  messages = inject(MessagesService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogsService);
  sanitizer = inject(DomSanitizer);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);
  router = inject(Router);

  isInternal = input.required<boolean>();
  meeting = input.required<Meeting>();

  deleteMeetingOccurrence = output<string>();

  meetingStartTime = signal('');
  meetingEndTime = signal('');
  loading = signal(false);

  RESOURCE = Resources;
  ACTION = Action;

  ngOnInit() {
    this.meetingStartTime.set(toLocaleTimeZone(this.meeting().date || ''));
    this.meetingEndTime.set(toLocaleTimeZone(this.meeting().endAt || ''));
  }

  openDialog(): void {
    this.dialogService
      .open({
        type: 'delete',
        title: 'MAIN.TITLE.DELETE_MEETING',
        message: 'MAIN.MESSAGE.DELETE_MEETING_MESSAGE',
        closeButtonTitle: 'GLOBAL.BUTTON.NO',
        confirmButtonTitle: 'GLOBAL.BUTTON.YES',
        value: this.meeting().id,
      })
      .subscribe((val) => {
        if (val) {
          this.deleteMeetingOccurrence.emit(this.meeting().id);
        }
      });
  }

  getSanitizedText(): SafeHtml {
    if (!this.meeting().location) return '';
    const urlPattern = urlRegExp;
    const replacedText = this.meeting().location.replace(
      urlPattern,
      (match, _, p2) => {
        let url = match;
        if (!p2) {
          url = 'http://' + match;
        }
        return `<a class="!text-primary" href="${url}" class="custom-link" target="_blank">${match}</a>`;
      }
    );
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }

  handleEditMeeting() {
    if (this.meeting().status === MeetingStatus.draft) {
      this.layout.isLoading.set(true);
      this.router.navigate(['/main/committee/meeting/'], {
        queryParams: {
          committeeId: this.activatedRoute.snapshot.queryParams['committeeId'],
          meetingId: this.meeting().meetingId,
        },
      });
    }

    if (this.meeting().status === MeetingStatus.planned) {
      this.layout.isLoading.set(true);
      this.router.navigate(['/main/committee/edit-occurrence/'], {
        queryParams: {
          committeeId: this.activatedRoute.snapshot.queryParams['committeeId'],
          occurrenceId: this.meeting().id,
        },
      });
    }
  }

  viewMeetingDetails() {
    if (this.isInternal()) {
      if (
        this.permissionsService.can(
          this.ACTION.viewDetails,
          this.RESOURCE.committeeMeeting,
          true
        )
      ) {
        this.router.navigate(['/main/committee/details'], {
          queryParams: {
            committeeId:
              this.activatedRoute.snapshot.queryParams['committeeId'],
            meetingId: this.meeting().id,
          },
        });
      } else {
        this.messages.show('error', 'MAIN.MESSAGE.USER_NOT_AUTHORIZED');
      }
    } else {
      this.dialog.open(MeetingDetailsDialogComponent, {
        width: '70%',
        maxHeight: '600px',
        direction: this.layout.direction(),
        data: {
          meeting: this.meeting(),
          isExternal: true,
        },
      });
    }
  }

  handleViewMeetingPollResult() {
    this.dialog.open(PollsResultDialogComponent, {
      width: '70%',
      maxHeight: '600px',
      direction: this.layout.direction(),
      data: {
        meetingId: this.meeting().id,
        meetingStatus: this.meeting().status,
        showVotingForAll: this.meeting().showVotingForAll,
      },
    });
  }
  handleViewMeetingPollResultExternal() {
    this.dialog.open(ExternalPollsDialogComponent, {
      width: '70%',
      maxHeight: '600px',

      direction: this.layout.direction(),
      data: {
        meetingStatus: this.meeting().status,
        topics: this.meeting().topics || [],
      },
    });
  }

  viewEditMeetingMinute(viewMode = false) {
    this.router.navigate(['/main/committee/meeting-minute'], {
      queryParams: {
        committeeId: this.activatedRoute.snapshot.queryParams['committeeId'],
        occurrenceId: this.meeting().id,
        ...(viewMode && { viewMode }),
      },
    });
  }

  handleExport() {
    this.layout.isLoading.set(true);
    this.meetingService.exportOccurrence(this.meeting().id).subscribe({
      next: (val) => {
        window.open(val.draftUrl, '_blank');
      },
      error: (error) => this.messages.show('error', error.message),
      complete: () => this.layout.isLoading.set(false),
    });
  }

  actions: MeetingAction[] = [
    {
      // Export meeting
      id: 1,
      handleClick: () => this.handleExport(),
      fontIcon: 'file_open',
      iconClasses: '!text-status-success',
      tooltip: 'GLOBAL.BUTTON.EXPORT_MINUTE',
      filter: [MeetingStatus.closed],
      isActive: this.permissionsService.can(
        this.ACTION.export,
        this.RESOURCE.committeeMeeting,
        true
      ),
    },
    {
      // close meeting minutes
      id: 2,
      handleClick: () => this.viewEditMeetingMinute(),
      fontIcon: 'description',
      iconClasses: '!text-primary',
      tooltip: 'GLOBAL.BUTTON.CLOSE_MINUTE',
      filter: [MeetingStatus.finished, MeetingStatus.inProgress],
      isActive: this.permissionsService.can(
        this.ACTION.create,
        this.RESOURCE.committeeMeetingMOM,
        true
      ),
    },
    {
      // View meeting minutes
      id: 3,
      handleClick: () => this.viewEditMeetingMinute(true),
      fontIcon: 'description',
      iconClasses: '!text-primary',
      tooltip: 'GLOBAL.BUTTON.VIEW_MINUTE',
      filter: [MeetingStatus.closed],
      isActive: this.permissionsService.can(
        this.ACTION.view,
        this.RESOURCE.committeeMeetingMOM,
        true
      ),
    },
    {
      // View Polls results
      id: 4,
      handleClick: () => this.handleViewMeetingPollResult(),
      fontIcon: 'bar_chart',
      iconClasses: '!text-status-warning',
      tooltip: 'GLOBAL.BUTTON.MEETING_POLLS',
      filter: [
        MeetingStatus.finished,
        MeetingStatus.inProgress,
        MeetingStatus.planned,
      ],
      isActive: this.permissionsService.can(
        this.ACTION.viewPolls,
        this.RESOURCE.committeeMeeting,
        true
      ),
    },
    {
      // Edit meeting
      id: 5,
      handleClick: () => this.handleEditMeeting(),
      fontIcon: 'border_color',
      iconClasses: '!text-primary',
      tooltip: 'GLOBAL.BUTTON.EDIT',
      filter: [MeetingStatus.planned, MeetingStatus.draft],
      isActive: this.permissionsService.can(
        this.ACTION.edit,
        this.RESOURCE.committeeMeeting,
        true
      ),
    },
    {
      // Delete meeting
      id: 6,
      handleClick: () => this.openDialog(),
      fontIcon: 'delete_forever',
      iconClasses: '!text-danger',
      tooltip: 'GLOBAL.BUTTON.DELETE',
      filter: [
        MeetingStatus.draft,
        MeetingStatus.inProgress,
        MeetingStatus.planned,
        MeetingStatus.finished,
      ],
      isActive: this.permissionsService.can(
        this.ACTION.delete,
        this.RESOURCE.committeeMeeting,
        true
      ),
    },
  ];
}

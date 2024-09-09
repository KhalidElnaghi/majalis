import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingsService } from '../../meetings.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { StatusChipComponent } from '../../../../components/status-chip/status-chip.component';
import { PollsVotingComponent } from '../polls-voting/polls-voting.component';

type Topic = {
  topicId: string;
  title: string;
  totalVoted: number;
  choices: Choice[];
};

type Choice = {
  choiceId: string;
  title: string;
  totalVoted: number;
  percentage: number;
};

@Component({
  selector: 'polls-result-dialog',
  standalone: true,
  imports: [
    TranslateModule,

    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatProgressBarModule,
    MatIconModule,
    MatIcon,

    StatusChipComponent,
    PollsVotingComponent,
  ],
  template: `
    @if(loading()) {
    <mat-progress-bar mode="indeterminate" />
    }
    <div
      class="!text-primary flex items-center justify-between mx-4 py-4"
      mat-dialog-title
    >
      <h1 class="text-xl">
        {{ 'MAIN.TITLE.VIEW_MEETING_POLLS' | translate }}
      </h1>
      <mat-dialog-actions>
        <mat-icon
          fontIcon="close"
          class="cursor-pointer"
          mat-dialog-close
        ></mat-icon>
      </mat-dialog-actions>
    </div>

    <status-chip [status]="this.dialogData.meetingStatus" class="mx-4" />

    <mat-dialog-content>
      <polls-voting
        [topics]="this.topics"
        [showVotingForAll]="this.dialogData.showVotingForAll"
      />
    </mat-dialog-content>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollsResultDialogComponent {
  private meetingService = inject(MeetingsService);
  private messageService = inject(MessagesService);
  dialogData = inject(MAT_DIALOG_DATA);
  loading = signal(false);

  topics: Topic[] = [];

  ngOnInit(): void {
    this.getTopicsResult(this.dialogData.meetingId);
  }

  getTopicsResult(meetingId: string) {
    this.loading.set(true);
    return this.meetingService.getTopicsResult(meetingId).subscribe({
      next: (data) => {
        this.topics = data;
      },
      error: (error) => {
        this.messageService.show('error', error.message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}

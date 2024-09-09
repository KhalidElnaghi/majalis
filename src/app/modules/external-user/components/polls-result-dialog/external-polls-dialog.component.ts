import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { ExternalPollsVotingComponent } from '../polls-voting/external-polls-voting.component';
import { StatusChipComponent } from '../../../main-user/components/status-chip/status-chip.component';

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
  selector: 'external-polls-dialog',
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
    ExternalPollsVotingComponent,
  ],
  template: `
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
      <external-polls-voting [topics]="this.topics" />
    </mat-dialog-content>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalPollsDialogComponent {
  dialogData = inject(MAT_DIALOG_DATA);

  topics: Topic[] = [];

  ngOnInit(): void {
    this.topics = this.dialogData.topics;
  }
}

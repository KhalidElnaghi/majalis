import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
  RouterLink,
  Router,
} from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { AttachmentChipComponent } from '../../../../shared/components/ui/attachment-chip/attachment-chip.component';

import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { Attachments } from '../../../../core/services/media.service';
import { ExternalService } from '../../external.service';

import { CustomDatePipe } from '../../../../shared/pipes/custom-date-pipe/custom-date-pipe.pipe';
import { otherChoiceIsRequired } from './meeting-vote.config';
import { externalRoutes } from '../../external.routes';
import { LayoutService } from '../../../../core/services/layout.service';

type Poll = {
  meetingOccurrenceId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  topics: Topic[];
};

type Topic = {
  id: string;
  title: string;
  requireVoting: boolean;
  otherChoice: boolean;
  attachments: Attachments[];
  choices: Choice[];
};

type Choice = {
  id: string;
  title: string;
  isOther: boolean;
};

@Component({
  selector: 'external-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,

    RouterOutlet,
    RouterLink,

    TranslateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatChipsModule,
    MatIcon,
    MatInputModule,

    AttachmentChipComponent,

    CustomDatePipe,
  ],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-4">
        <p class="text-gray-500 font-semibold">
          {{ 'EXTERNAL.LABEL.MEETING_NAME' | translate }} :
        </p>
        <p>{{ this.pollsData.title }}</p>
      </div>
      <div class="flex items-center gap-4">
        <p class="text-gray-500 font-semibold">
          {{ 'EXTERNAL.LABEL.MEETING_TIME' | translate }} :
        </p>
        <p>
          {{ this.pollsData.date | customDatePipe : 'dd-MM-yyyy' }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <p class="text-gray-500 font-semibold">
          {{ 'EXTERNAL.LABEL.MEETING_LOCATION' | translate }} :
        </p>
        <p>{{ this.pollsData.location }}</p>
      </div>
      <p class="my-5 text-gray-500 font-semibold">
        {{ 'EXTERNAL.TITLE.VOTING_ON_THE_POLLS_OF_THE_MEETING' | translate }}
      </p>
    </div>

    <form
      (ngSubmit)="handleSendVote(form)"
      class="flex flex-col gap-y-2"
      id="voting"
      [formGroup]="form"
    >
      <div class="flex flex-col gap-5">
        <div formArrayName="topics">
          @for( topic of formArray.controls; track topic; let count = $index){
          <ng-container [formGroupName]="count">
            <div class="flex flex-col border border-1 p-3 rounded gap-4 my-2">
              <div class="flex items-center gap-4">
                <p class="text-gray-500 font-semibold">
                  {{ 'EXTERNAL.LABEL.POLL' | translate }}
                </p>
                <p>{{ topic.value.title }}</p>
              </div>

              @if(topic.value.choicesList && topic.value.choicesList.length >0
              ){
              <div class="flex items-start">
                <p class="text-gray-500 font-semibold">
                  {{ 'EXTERNAL.LABEL.OPTIONS' | translate }}
                </p>
                <mat-radio-group
                  formControlName="choiceField"
                  aria-label="Select an option"
                  class="flex flex-col"
                >
                  @for(choice of topic.value.choicesList; track choice){

                  <!-- Meeting Polls -->
                  @if( !choice.isOther){

                  <mat-radio-button [value]="choice.id">
                    {{ choice.title }}
                  </mat-radio-button>

                  }

                  <!-- Other choice text field -->
                  @if(topic.value.otherChoice && choice.isOther){

                  <mat-radio-button [value]="choice.id">
                    <div class="flex justify-center items-center gap-4">
                      <p>{{ 'EXTERNAL.LABEL.OTHER' | translate }}</p>

                      <mat-form-field class="max-md:max-w-[150px]">
                        <input
                          formControlName="otherChoiceField"
                          type="text"
                          matInput
                        />

                        @if(topic.get('otherChoiceField')?.errors?.['required']){

                        <mat-error>
                          {{ 'MAIN.ERROR.FIELD_REQUIRED' | translate }}
                        </mat-error>

                        }
                      </mat-form-field>
                    </div>
                  </mat-radio-button>

                  } }
                </mat-radio-group>
              </div>
              }

              <!-- Attachments -->
              @if(topic.value.attachments && topic.value.attachments.length>0){
              <div class="flex gap-4 mt-2">
                <p class="text-gray-500 font-semibold">
                  {{ 'EXTERNAL.LABEL.ATTACHMENTS' | translate }}
                </p>

                <div class="flex gap-3 max-sm:flex-col">
                  @for(attachment of topic.value.attachments; track attachment){
                  <attachment-chip [fileData]="attachment" />
                  }
                </div>
              </div>
              }
            </div>
          </ng-container>
          }
        </div>
      </div>
    </form>

    <button
      [disabled]="form.invalid"
      mat-raised-button
      color="primary"
      form="voting"
      class="!px-14 my-4"
    >
      <span>
        {{ 'EXTERNAL.BUTTON.SEND_VOTING' | translate }}
      </span>
    </button>
  `,
})
export default class ExternalUserComponent {
  private externalService = inject(ExternalService);
  private messageService = inject(MessagesService);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  layout = inject(LayoutService);
  router = inject(Router);

  pollsData: Poll = this.activatedRoute.snapshot.data['polls'];
  secret = this.activatedRoute.snapshot.queryParams['secret'];
  test = this.activatedRoute.snapshot.queryParams['test'];

  form = this.formBuilder.group({
    topics: this.formBuilder.array([]),
  });

  constructor() {
    this.pollsData.topics.forEach((topic) => {
      this.formArray.push(this.generateMeetingTopic(topic));
    });
  }

  get formArray() {
    return this.form.controls.topics as FormArray;
  }

  generateMeetingTopic(topic: Topic): FormGroup {
    return this.formBuilder.group(
      {
        title: [topic.title],
        id: [topic.id],
        otherChoice: [topic.otherChoice],
        otherChoiceField: [null],
        attachments: [topic.attachments],
        choicesList: [topic.choices],
        choiceField: [null, topic.choices.length ? [Validators.required] : []],
      },
      {
        validators: [otherChoiceIsRequired],
      }
    );
  }

  handleSendVote(form: FormGroup) {
    let choices: any = [];
    if (!form.valid) return;

    form.value.topics
      .filter((topic: any) => topic.choicesList.length)
      .forEach((topic: any) => {
        choices.push({
          topicId: topic.id,
          choiceId: topic.choiceField,
          otherChoice: topic.otherChoiceField,
        });
      });

    const { withOTP } = this.activatedRoute.snapshot.queryParams;

    const voteType = withOTP
      ? this.externalService.sendVoteByOTP({
          userSecret: this.secret,
          choices,
        })
      : this.externalService.sendVote({
          userSecret: this.secret,
          choices,
        });

    this.layout.isLoading.set(true);

    voteType.subscribe({
      next: () => {
        this.messageService.show(
          'success',
          'EXTERNAL.MESSAGE.VOTED_SUCCESS',
          2
        );
        this.router.navigate([externalRoutes.MEETING_VOTE_SUCCESS]);
        this.layout.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.show('error', error.message);
        this.layout.isLoading.set(false);
      },
    });
  }
}

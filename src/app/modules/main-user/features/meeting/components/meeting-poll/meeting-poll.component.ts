import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { lastValueFrom } from 'rxjs';

import { MatError, MatFormField } from '@angular/material/form-field';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { MediaService } from '../../../../../../core/services/media.service';
import { MeetingsService } from '../../meetings.service';

import { acceptableAttachments } from '../../pages/meeting-stepper/meeting-stepper.config';
import { AjendaForm, CommitteeSingleMeeting } from '../../../../main.types';

@Component({
  selector: 'meeting-poll',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,

    MatFormField,
    MatError,
    MatInput,
    MatButtonModule,
    MatRadioButton,
    MatIcon,
    MatChipsModule,
    MatSlideToggle,
    MatTooltip,
    MatDivider,
  ],
  templateUrl: './meeting-poll.component.html',
})
export class MeetingPollComponent {
  private activatedRoute = inject(ActivatedRoute);
  private messages = inject(MessagesService);
  meetingService = inject(MeetingsService);
  private layout = inject(LayoutService);
  media = inject(MediaService);
  meetingData = (this.activatedRoute.snapshot.data[
    'details'
  ] || this.activatedRoute.snapshot.data[
    'occurrenceData'
  ])  as CommitteeSingleMeeting;
  index = input.required<number>();
  form = input.required<AjendaForm>();

  active = computed(() => {
    return this.fieldControl('active');
  });

  getFormGroup() {
    return this.form().get<string>(`topics.${this.index()}`) as FormGroup;
  }

  fieldControl<T = any>(controlName: string) {
    return this.form().get(`topics.${this.index()}.${controlName}`) as T;
  }

  addChoice() {
    const nameControl = this.fieldControl<FormControl>('choiceName');
    if (nameControl.value.trim().length < 1) return;
    const control =
      this.fieldControl<FormControl<{ title: string }[]>>('choices');
    control.setValue([...control.value, { title: nameControl.value }]);
    nameControl.setValue('');
  }

  removeChoice(index: number) {
    const control = this.fieldControl<FormControl<any[]>>('choices');
    control.setValue(control.value.filter((_, i) => i !== index));
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) return;
    const attachmentControl = this.fieldControl<FormArray>('attachments');
    const files = [];
    for (let i = 0; i < inputElement.files.length; i++) {
      const file: File = inputElement.files.item(i)!;
      const typeName = file.type.split('/')[1];
      if (!acceptableAttachments.includes(typeName)) {
        this.messages.show('error', 'MAIN.ERROR.UNSUPPORTED_FILE_TYPE');
        return;
      }
      files.push({ name: file.name, url: file });
    }
    attachmentControl.setValue([...attachmentControl.value, ...files]);
  }

  removeFile(index: number) {
    const control = this.fieldControl<FormControl<File[]>>('attachments');
    control.setValue(control.value.filter((_, i) => i !== index));
  }

  activateTopic() {
    this.fieldControl('active').setValue(true);
  }

  deleteTopic() {
    const id = this.fieldControl('id').value;
    const topics = this.form().get('topics') as FormArray;
    if (!id) {
      topics.removeAt(this.index());
      return;
    }
    this.layout.isLoading.set(true);
    this.meetingService
      .deleteMeetingTopic(this.meetingData.value.id, id)
      .subscribe({
        next: () => topics.removeAt(this.index()),
        error: (err) => this.messages.show('error', err.message),
        complete: () => this.layout.isLoading.set(false),
      });
  }
  async saveAttachments(attachment: any) {
    if (attachment.url instanceof File) {
      const { message }: any = await lastValueFrom(
        this.media.uploadFile(attachment.url)
      );

      attachment = {
        name: message.name,
        url: message.id,
        type: message.contentType,
      };
    }
    return attachment;
  }

  async upsertTopic() {
    this.getFormGroup().markAllAsTouched();
    if (!this.getFormGroup().valid) return;
    this.layout.isLoading.set(true);
    const form = this.getFormGroup().value;

    const data = {
      id: form.id,
      title: form.title,
      choices: form.choices,
      otherChoice: form.otherChoice,
      attachments: await Promise.all(
        (form.attachments as any[]).map(this.saveAttachments, this)
      ),
    };
    const showError = (err: any) => this.messages.show('error', err.message);
    const stopLoading = () => this.layout.isLoading.set(false);
    if (data.id) {
      this.meetingService
        .editMeetingTopic(this.meetingData.value.id, data.id, data)
        .subscribe({
          next: (value: any) => {
            this.fieldControl('active').setValue(false);
            this.getFormGroup().patchValue({ ...value });
          },
          error: showError,
          complete: stopLoading,
        });
    } else {
      this.meetingService
        .addMeetingTopic(this.meetingData.value.id, data)
        .subscribe({
          next: (res) => {
            this.fieldControl('active').setValue(false);
            this.fieldControl('id').setValue(res.id);
            this.getFormGroup().patchValue({ ...res });
          },
          error: showError,
          complete: stopLoading,
        });
    }
  }
}

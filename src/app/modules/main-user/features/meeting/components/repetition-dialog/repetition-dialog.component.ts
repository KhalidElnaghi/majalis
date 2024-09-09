import { MeetingsService } from './../../meetings.service';
import { Component, inject, input, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

import { distinctUntilChanged, startWith } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { CustomDatePickerComponent } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.component';
import { CustomDateAdapterService } from '../../../../../../shared/components/form-controls/custom-date-picker/custom-date-picker.service';
import { Days } from '../../pages/meeting-stepper/meeting-stepper.config';
import {
  validateRepetition,
  repetitionTypes,
  RepetitionTypes,
  dynamicFilterRepetitionData,
} from './repetition-dialog-config';
import { DatePipe } from '@angular/common';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { weekDays } from '../../../../main.types';

@Component({
  selector: 'new-committe-dialog',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    TranslateModule,

    MatProgressBar,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatSelectModule,
    MatDialogClose,
    MatInputModule,
    MatDialogTitle,
    MatRadioModule,
    MatIconModule,

    CustomDatePickerComponent,
  ],
  templateUrl: './repetition-dialog.component.html',
})
export class RepetitionDialogComponent {
  dateService = inject(CustomDateAdapterService);
  dialog = inject(MatDialogRef<unknown>);
  dialogData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  datePipe = inject(DatePipe);
  meetingService = inject(MeetingsService);
  messageService = inject(MessagesService);

  loading = signal(false);

  TYPES = repetitionTypes;
  DAYS = Days;

  typesEnum = RepetitionTypes;
  preSelectedDate: {
    number: number;
    name: string;
    order: string;
  } = {
    number: 0,
    name: '',
    order: '',
  };

  form = this.formBuilder.group(
    {
      type: [RepetitionTypes.daily, []],
      typeCount: [1, []],
      weekDays: [[], []],
      day: ['this-date', []],

      end: ['never', []],
      endAt: ['', []],
      maxRepetitionCount: [1, [Validators.required]],
    },
    {
      validators: [validateRepetition],
    }
  );
  repetitionTypes: any;

  // #region Methods

  fieldControl(controlName: string) {
    return this.form.get(controlName);
  }

  ngOnInit(): void {
    this.handleEndingOptionChange();

    this.preSelectedDate = this.handlePredefinedData(this.dialogData.date);

    if (this.dialogData.data) {
      const savedRepetitionData = this.dialogData.data;
      savedRepetitionData.expireDate = this.dateService.convertDate(
        savedRepetitionData.expireDate
      );

      this.form.patchValue(savedRepetitionData);
    }
  }

  incrementValue(controlName: string) {
    const control = this.fieldControl(controlName);

    if (
      controlName === 'maxRepetitionCount' &&
      control &&
      control.value < this.fieldControl('typeCount')?.value
    ) {
      control.setValue(control.value + 1);
    }
    if (control && controlName === 'typeCount' && control.value < 10) {
      control.setValue(control.value + 1);
    }
  }

  decrementValue(controlName: string) {
    const control = this.fieldControl(controlName);
    if (control && control.value > 1) {
      control.setValue(control.value - 1);
    }
    if (
      control &&
      this.fieldControl('maxRepetitionCount')?.value > control.value
    ) {
      this.fieldControl('maxRepetitionCount')?.setValue(
        this.fieldControl('maxRepetitionCount')?.value - 1
      );
    }
  }

  handlePredefinedData(dateValue: string) {
    const date = new Date(dateValue).toDateString().split(' ');

    const number = +date[2];
    const name = date[0];
    let order;

    if (+number > 0 && +number <= 7) {
      order = 'First';
    } else if (+number > 7 && +number <= 14) {
      order = 'Second';
    } else if (+number > 14 && +number <= 21) {
      order = 'Third';
    } else {
      order = 'Fourth';
    }

    return {
      number,
      name,
      order,
    };
  }

  handleEndingOptionChange() {
    this.form.controls.end.valueChanges
      .pipe(startWith('never'), distinctUntilChanged())
      .subscribe((res) => {
        if (res == 'date') {
          this.form.get('expireDate')?.enable({ emitEvent: false });
        } else {
          this.form.get('expireDate')?.disable({ emitEvent: false });
        }

        if (res == 'count') {
          this.form
            .get('expirationRepetitionCount')
            ?.enable({ emitEvent: false });
        } else {
          this.form
            .get('expirationRepetitionCount')
            ?.disable({ emitEvent: false });
        }
      });
  }

  submitForm(form: FormGroup) {
    const { date, committeeId, meetingId } = this.dialogData;
    if (!form.valid) return;

    if (this.dialogData.isEdit) {
      const repetitionValue = dynamicFilterRepetitionData(
        {
          ...form.value,
          ...(form.value.endAt && {
            endAt: this.datePipe.transform(form.value.endAt, 'yyyy-MM-dd'),
          }),
        },
        this.datePipe.transform(new Date(date), 'EEEE') as weekDays[number]
      );
      this.dialog.close(repetitionValue);
      return;
    }
    const reqBody = {
      meetingId,
      repetition: dynamicFilterRepetitionData(
        {
          ...form.value,
          ...(form.value.endAt && {
            endAt: this.datePipe.transform(form.value.endAt, 'yyyy-MM-dd'),
          }),
        },
        this.datePipe.transform(new Date(date), 'EEEE') as weekDays[number]
      ),
    };
    this.meetingService.saveAsDraft(committeeId, reqBody).subscribe({
      next: () => {
        this.loading.set(true);
        this.dialog.close(form.value);
      },
      error: (error) => this.messageService.show('error', error.message),
      complete: () => this.loading.set(false),
    });
    return;
  }
}

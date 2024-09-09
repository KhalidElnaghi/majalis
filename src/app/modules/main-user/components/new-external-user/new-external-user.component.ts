import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DataTableComponent } from '../../../../shared/components/ui/data-table/data-table.component';

import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { MainService } from '../../main.service';

@Component({
  selector: 'new-external-member',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,

    MatFormFieldModule,
    MatProgressBar,
    MatTooltipModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogClose,
    MatSuffix,
    MatSort,
    MatIcon,

    TranslateModule,

    DataTableComponent,
  ],
  templateUrl: './new-external-user.component.html',
})
export class NewExternalUserComponent {
  dialogRef = inject(MatDialogRef<unknown>);
  translation = inject(TranslateService);
  dialogData = inject(MAT_DIALOG_DATA);
  messages = inject(MessagesService);
  formBuilder = inject(FormBuilder);
  mainService = inject(MainService);

  isLoading = false;

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    username: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/),
      ],
    ],
    phone: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern(/^5[503649187]\d{7}$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  handleAddMembers(form: FormGroup) {
    if (form.valid) {
      this.isLoading = true;
      this.mainService.addExternalMembers(form.value).subscribe({
        next: () => {
          this.messages.show('success', 'MAIN.MESSAGE.ADD_SUCCESS', 3);
          this.dialogRef.close('successfull creation');
        },
        error: (error) => {
          this.messages.show('error', error.message);
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
    }
  }
}

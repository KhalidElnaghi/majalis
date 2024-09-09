import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LayoutService } from '../../../../core/services/layout.service';
import { MeetingsService } from '../../../../modules/main-user/features/meeting/meetings.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDatePipe } from '../../../pipes/custom-date-pipe/custom-date-pipe.pipe';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormField,
  MatFormFieldModule,
  MatPrefix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { MessagesService } from '../../ui/snackbars/messages.service';
import { StatusChipComponent } from '../../../../modules/main-user/components/status-chip/status-chip.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'meetings-search-and-filter',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,

    MatButtonModule,
    MatFormField,
    MatPrefix,
    MatInput,
    MatIcon,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltip,

    StatusChipComponent,
    TranslateModule,
    CustomDatePipe,
  ],
  template: ` <div>
    <form
      [formGroup]="form"
      (ngSubmit)="submitForm(form)"
      id="my-meetings-filer"
      class="flex gap-3 flex-col "
    >
      <div class="w-full flex gap-3">
        <mat-form-field appearance="outline" class="max-md:w-full flex-grow">
          <input
            (click)="$event.stopPropagation()"
            (focus)="$event.stopPropagation()"
            placeholder="{{
              'MAIN.LABEL.SEARCH_BY_NAME_OR_LOCATION' | translate
            }}"
            formControlName="search"
            matInput
          />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <button
          [matTooltip]="'GLOBAL.BUTTON.SORT' | translate"
          class="self-baseline flex"
          type="button"
          (click)="sort()"
        >
          <mat-icon class="self-baseline" color="primary">
            {{
              this.sorting === 'Date DESC' ? 'arrow_upward' : 'arrow_downward'
            }}</mat-icon
          >
          <mat-icon color="primary">sort</mat-icon>
        </button>
        <button
          [matTooltip]="'GLOBAL.BUTTON.FILTERS' | translate"
          class="self-baseline"
          color="primary"
          mat-icon-button
          type="button"
          (click)="showFilter()"
        >
          <mat-icon>filter_list</mat-icon>
        </button>
      </div>

      <div class="flex max-md:flex-col gap-3">
        @if(this.showFilters()){

        <mat-form-field appearance="outline" class="max-md:w-full">
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="date"
            readonly
          />
          <ng-container matIconSuffix>
            <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
            <mat-icon (click)="clearDate()" color="warn">clear</mat-icon>
          </ng-container>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="max-md:w-full">
          <mat-label>{{ 'MAIN.LABEL.MEETING_STATUS' | translate }}</mat-label>
          <mat-select formControlName="status">
            <mat-option value=" ">
              {{ 'MAIN.LABEL.ALL' | translate }}
            </mat-option>
            @for (item of status; track item) {
            <mat-option [value]="item.value">
              <status-chip [status]="item.value"
            /></mat-option>
            }
          </mat-select>
        </mat-form-field>
        <button
          [disabled]="form.invalid"
          form="my-meetings-filer"
          mat-flat-button
          color="primary"
          class="!inline-block mt-2 !self-start"
        >
          {{ 'GLOBAL.BUTTON.SEARCH' | translate }}
        </button>
        }
      </div>
    </form>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingsSearchAndFilterComponent {
  layoutService = inject(LayoutService);
  messageService = inject(MessagesService);
  formBuilder = inject(FormBuilder);

  showFilters = signal<boolean>(false);

  getMyMeetings = output<{
    search: string | null | undefined;
    sorting: string | null | undefined;
    date: string | null | undefined;
    status: string | null | undefined;
  }>();

  sorting = 'Date DESC';

  form = this.formBuilder.group({
    search: [],
    status: [],
    date: [],
  });

  private searching$ = this.form.get('search')?.valueChanges!;

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.searching$
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(),
        switchMap((searchKey) => this.getSearch(searchKey || ''))
      )
      .subscribe({
        next: () => {},
        error: () => {},
        complete: () => {},
      });
  }

  status = [
    { value: 'Closed', title: 'CLOSED' },
    { value: 'Finished', title: 'FINISHED' },
    { value: 'InProgress', title: 'INPROGRESS' },
    { value: 'Planned', title: 'PLANNED' },
    { value: 'Draft', title: 'DRAFT' },
  ];

  clearDate() {
    this.form.controls.date.reset();
  }
  showFilter() {
    this.showFilters() === true
      ? this.showFilters.set(false)
      : this.showFilters.set(true);
  }
  submitForm(form: FormGroup) {
    this.getMyMeetings.emit({
      search: this.form.value.search,
      sorting: this.sorting,
      date: this.form.value.date,
      status: this.form.value.status,
    });
  }
  getSearch(search: string) {
    this.getMyMeetings.emit({
      search: search,
      sorting: this.sorting,
      date: this.form.value.date,
      status: this.form.value.status,
    });
    return search;
  }
  sort() {
    this.sorting = this.sorting === 'Date DESC' ? 'Date ASC' : 'Date DESC';
    this.getMyMeetings.emit({
      search: this.form.value.search,
      sorting: this.sorting,
      date: this.form.value.date,
      status: this.form.value.status,
    });
  }
}

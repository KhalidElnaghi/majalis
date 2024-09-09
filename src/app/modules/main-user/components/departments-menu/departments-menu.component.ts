import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  contentChild,
  TemplateRef,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import {
  distinctUntilChanged,
  debounceTime,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { MessagesService } from '../../../../shared/components/ui/snackbars/messages.service';
import { EntityType, Member, PaginatedResponse } from '../../main.types';
import { MainService } from '../../main.service';

@Component({
  selector: 'departments-menu',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,

    MatProgressSpinner,
    MatButtonModule,
    MatMenuModule,
    MatFormField,
    MatPrefix,
    MatInput,
    MatIcon,

    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [matMenuTriggerFor]="menu" mat-icon-button color="primary">
      <mat-icon fontSet="material-icons-outlined">lan</mat-icon>
    </button>

    <mat-menu #menu="matMenu" class="!px-2 !rounded-xl">
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="w-full">
          <input
            (click)="$event.stopPropagation()"
            (focus)="$event.stopPropagation()"
            placeholder="{{ 'MAIN.LABEL.SEARCH_BY_NAME' | translate }}"
            formControlName="search"
            matInput
          />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </form>

      @if(isLoading()){
      <mat-spinner diameter="30" class="!mx-auto !mb-2" />
      }

      <!--  -->
      @if(menuItems().length !== 0){

      <!-- Menu items -->
      @for(item of menuItems(); track item){

      <ng-container
        *ngTemplateOutlet="
          customMenuItem() || defaultMenuItem;
          context: { $implicit: item }
        "
      ></ng-container>

      } } @else {

      <div class="text-center rounded-lg bg-light py-2">
        {{ 'GLOBAL.MESSAGE.NO_DATA_TO_DISPLAY' | translate }}
      </div>
      }
    </mat-menu>

    <ng-template #defaultMenuItem let-item>
      <button (click)="selectedDepartment.emit(item.id)" mat-menu-item>
        {{ item.nameAr ?? item.name }}
        <mat-icon fontSet="material-icons-outlined">lan</mat-icon>
      </button>
    </ng-template>
  `,
})
export class DepartmentsMenuComponent {
  messageService = inject(MessagesService);
  mainService = inject(MainService);
  formBuilder = inject(FormBuilder);
  entityType = EntityType;

  customMenuItem = contentChild<TemplateRef<unknown>>('customItem');

  menuItems = signal<Member[]>([]);
  isLoading = signal<boolean>(false);

  selectedDepartment = output<string>();

  protected form = this.formBuilder.group({
    search: [],
  });

  private searching$ = this.form.get('search')?.valueChanges!;

  constructor() {
    this.getDepartments();
  }

  getDepartments() {
    this.searching$
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.isLoading.set(true)),
        switchMap((searchKey) =>
          this.mainService.getEntities({
            page: 0,
            maxResult: 6,
            entityType: this.entityType.department,
            search: searchKey || '',
          })
        )
      )
      .subscribe({
        next: (response: PaginatedResponse<Member>) => {
          this.isLoading.set(false);
          this.menuItems.set(response.items);
        },

        error: (error) => {
          this.isLoading.set(false);
          this.messageService.show('error', error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.searching$.subscribe();
  }
}

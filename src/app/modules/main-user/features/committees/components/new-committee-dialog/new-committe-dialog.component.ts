import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  MatMenuContent,
  MatMenuTrigger,
  MatMenuItem,
  MatMenu,
} from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  MatDialog,
} from '@angular/material/dialog';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { userSelectionModal } from '../../../../components/user-selection-modal/user-selection-modal.component';
import {
  DataTableComponent,
  ColumnDefinition,
} from '../../../../../../shared/components/ui/data-table/data-table.component';

import { LayoutService } from '../../../../../../core/services/layout.service';
import { LANG } from '../../../../../../core/services/translation.service';
import { MainService } from '../../../../main.service';

import { removeArrayDuplicates } from '../../../../../../shared/utils/data-transformation';
import { Committee, Member, MemberType, Rule } from '../../../../main.types';
import { CommitteesService } from '../../committees.service';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';

@Component({
  selector: 'new-committe-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,

    MatFormFieldModule,
    MatTooltipModule,
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogClose,
    MatTableModule,
    MatMenuContent,
    MatMenuTrigger,
    MatMenuItem,
    MatSort,
    MatIcon,
    MatMenu,

    DataTableComponent,
    TranslateModule,
  ],
  templateUrl: './new-commite-dialog.component.html',
})
export class NewCommitteDialogComponent {
  committeeService = inject(CommitteesService);
  dialogRef = inject(MatDialogRef<unknown>);
  messageService = inject(MessagesService);
  translation = inject(TranslateService);
  mainService = inject(MainService);
  formBuilder = inject(FormBuilder);
  layout = inject(LayoutService);
  dialog = inject(MatDialog);
  dialogData = inject<{
    committee?: Committee;
    placeHolder: string;
    edit?: boolean;
  }>(MAT_DIALOG_DATA);

  isLoading = signal<boolean>(false);

  sort = viewChild.required(MatSort);

  selectedRow = signal<any>(undefined);
  selectedRules = signal<Record<string, Rule>>({});
  selected = signal<Member[]>([]);
  rules = signal<Rule[]>([]);

  items = new MatTableDataSource<Member>();
  memberType = MemberType;
  lang = LANG;

  form = this.formBuilder.group({
    committeName: ['', [Validators.required]],
  });

  columns: ColumnDefinition[] = [
    { key: 'username', name: 'MAIN.TITLE.USERNAME' },
    { key: 'name', name: 'MAIN.TITLE.NAME' },
    { key: 'rule', custom: true },
    { key: 'actions', custom: true },
  ];

  setSort = effect(() => {
    this.items.sort = this.sort();
  });

  ngOnInit() {
    this.setCommittee();
    this.mainService.getRules().subscribe({
      next: (data) => {
        this.rules.set(data);
      },
    });
  }

  // #region Methods
  setSelection(values: { entity: Member[] | Member; checked: boolean }) {
    const { entity, checked } = values;
    if (Array.isArray(entity) && checked) {
      this.selected.set(entity);
      return;
    }
    if (Array.isArray(entity) && !checked) {
      this.selected.set([]);
      return;
    }

    if (!Array.isArray(entity) && checked) {
      this.selected.update((currentValue) => [...currentValue, entity]);
    }
    if (!Array.isArray(entity) && !checked) {
      this.selected.update((currentValue) =>
        currentValue.filter((x) => x.id !== entity.id)
      );
    }
  }

  setCommittee() {
    if (!this.dialogData.committee) return;
    this.form.setValue({
      committeName: this.dialogData.committee.name,
    });
    const internal = this.dialogData.committee.internalMembers.map((x) => {
      if (x.ruleId) {
        this.selectedRules.update((r) => ({
          ...r,
          [x.id]: {
            id: x.ruleId!,
            nameEn: x.ruleNameEn!,
            nameAr: x.ruleNameAr!,
          },
        }));
      }
      return {
        ...x,
        memberType: MemberType.internal,
      };
    });
    const external = this.dialogData.committee.externalMembers.map((x) => {
      if (x.ruleId) {
        this.selectedRules.update((r) => ({
          ...r,
          [x.id]: {
            id: x.ruleId!,
            nameEn: x.ruleNameEn!,
            nameAr: x.ruleNameAr!,
          },
        }));
      }
      return {
        ...x,
        memberType: MemberType.external,
      };
    });
    this.items.data = [...internal, ...external];
  }

  handleAddMembers() {
    this.dialog
      .open(userSelectionModal, {
        width: '90%',
        maxWidth: '800px',
        maxHeight: '95vh',
        direction: this.layout.direction(),

        data: {
          selected: this.items.data,
          titles: {
            main: 'MAIN.LABEL.ADD_COMMITTEE_MEMBERS',
            internalTab: 'MAIN.LABEL.INTERNAL_MEMBERS',
            externalTab: 'MAIN.LABEL.EXTERNAL_MEMBERS',
            addButton: 'MAIN.BUTTON.ADD_EXTERNAL_EMPLOYEE',
          },
          category: 'committee',
        },
      })
      .afterClosed()
      .subscribe((data: Member[]) => {
        if (!data) return;
        this.items.data = removeArrayDuplicates(data, 'id');
      });
  }

  removeMembers(row: string[]) {
    this.items.data = this.items.data.filter((item) => !row.includes(item.id));
    row.forEach((x) => {
      this.selectedRules.update((y) => {
        delete y[x];
        return y;
      });
    });
  }

  removeSelection() {
    const selectedIds = this.selected().map((x) => x.id);
    this.items.data = this.items.data.filter(
      (x) => !selectedIds.includes(x.id)
    );
    selectedIds.forEach((x) => {
      this.selectedRules.update((y) => {
        delete y[x];
        return y;
      });
    });
  }

  setSelectedRow(row: any) {
    this.selectedRow.set(row);
  }

  setRuleForMember(rule: Rule) {
    this.selectedRules.update((r) => ({ ...r, [this.selectedRow().id]: rule }));
  }

  submitForm(form: FormGroup) {
    if (!form.valid) return;
    this.isLoading.set(true);
    const internal = this.items.data
      .filter((x: Member) => x.memberType === this.memberType.internal)
      .map((x) => ({
        id: x.id,
        name: x.name,
        username: x.username,
        email: x.email,
        phone: x.phone,
        ruleId: this.selectedRules()[x.id]?.id,
      }));

    const external = this.items.data
      .filter((x: Member) => x.memberType === this.memberType.external)
      .map((x) => ({
        memberId: x.id,
        ruleId: this.selectedRules()[x.id]?.id,
      }));

    const data = {
      id: this.dialogData.committee?.id,
      name: this.form.value.committeName,
      internalMembers: internal,
      externalMembers: external,
    };

    const atLeastOneHasRule = [...internal, ...external].find((x) => x.ruleId);
    if (!atLeastOneHasRule) {
      this.messageService.show('error', 'MAIN.MESSAGE.RULE_REQUIRED');
      this.isLoading.set(false);
      return;
    }
    const method = data.id
      ? this.committeeService.editCommittee(data)
      : this.committeeService.addCommittee(data);

    method.subscribe({
      next: () => {
        this.messageService.show(
          'success',
          data.id ? 'MAIN.MESSAGE.EDIT_SUCCESS' : 'MAIN.MESSAGE.ADD_SUCCESS',
          3
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.messageService.show('error', error.message);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}

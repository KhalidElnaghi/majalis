import { Injectable, inject, signal } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { HttpService } from '../../../../core/services/http.service';

import { MAIN_MJALES_API } from '../../main.api';
import { Committee } from '../../main.types';
@Injectable({
  providedIn: 'root',
})
export class CommitteesService {
  auth = inject(AuthenticationService);
  HTTP = inject(HttpService);

  selection = new SelectionModel<Committee>(true, []);
  committeesList = signal<Committee[]>([]);

  get allSelected() {
    return this.selection.selected.length === this.committeesList().length;
  }

  toggleAll(isChecked: boolean): void {
    if (isChecked) {
      this.selection.select(...this.committeesList());
    } else {
      this.selection.clear();
    }
  }

  toggleItem(committee: Committee): void {
    this.selection.toggle(committee);
  }

  // TODO: searching keys need to be listed in an enum
  getCommittees(
    pageIndex = 0,
    MaxResultCount = 10,
    Sorting = 'creationTime DESC',
    search = ''
  ) {
    return this.HTTP.getData<{ items: Committee[]; totalCount: number }>(
      MAIN_MJALES_API.COMMITTEE_LIST,
      {
        SkipCount: pageIndex * MaxResultCount,
        MaxResultCount,
        Sorting,
        search,
      }
    );
  }

  getSingleCommittee(committeeId: string) {
    return this.HTTP.getDataById<{ result: unknown; value: Committee }>(
      MAIN_MJALES_API.COMMITTEE_SINGLE,
      committeeId
    );
  }

  addCommittee(data: any) {
    return this.HTTP.sendData<Committee, Committee>(
      MAIN_MJALES_API.COMMITTEE_ADD,
      data
    );
  }
  editCommittee(data: any) {
    return this.HTTP.updateData<'put', Committee>(
      'put',
      MAIN_MJALES_API.EDIT_COMMITTEE(data.id),
      data
    );
  }
  deleteCommittee(id: string) {
    return this.HTTP.deleteData(MAIN_MJALES_API.DELETE_COMMITTEE(id));
  }
  deleteSelectedCommittees() {
    const ids = this.selection.selected.map((x) => x.id);
    return this.HTTP.deleteData(MAIN_MJALES_API.DELETE_COMMITTEES, { ids });
  }
}

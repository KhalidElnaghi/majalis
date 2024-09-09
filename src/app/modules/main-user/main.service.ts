import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs';

import { MAIN_APP_API, MAIN_MJALES_API } from './main.api';

import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpService } from '../../core/services/http.service';
import {
  PaginatedResponse,
  EntityType,
  MemberType,
  Member,
} from './main.types';

interface EntityData {
  entityType?: EntityType.employee | EntityType.department;
  departmentId?: string;
  maxResult: number;
  search?: string;
  page: number;
}

@Injectable({
  providedIn: 'root',
})
export class MainService {
  auth = inject(AuthenticationService);
  HTTP = inject(HttpService);

  getMainDepartment() {
    return this.HTTP.getData<any>(MAIN_APP_API.MAIN_DEPARTMENT);
  }

  getRules() {
    return this.HTTP.getData<any>(MAIN_MJALES_API.COMMITTEE_RULES);
  }

  getDepatment() {
    return this.HTTP.getData<any>(
      MAIN_APP_API.DEPARTMENT_DETAILS(this.auth.userData['MainDepartment'])
    );
  }

  // TODO: sorting & searching keys need to be listed in an enum
  ignorePermission = true ? 'all-entities' : 'paged-entities';
  getEntities(data: EntityData) {
    return this.HTTP.getData<PaginatedResponse<any>>(
      MAIN_APP_API.ENTITY_LIST + this.ignorePermission,
      {
        SkipCount: data.page * data.maxResult,
        MaxResultCount: data.maxResult,
        EntityType: data.entityType,
        filter: data.search || '',
        departmentId: data.departmentId || '',
      }
    ).pipe(
      map((data: PaginatedResponse<any>) => ({
        items: data.items.map(
          (x): Member => ({
            id: x.entityId,
            name: x.entityName,
            nameAr: x.arabicName,
            department: x.mainDepartmentEn,
            departmentAr: x.mainDepartmentAr,
            username: x.userName,
            email: x.email,
            phone: x.mobileNumber,
            memberType: MemberType.internal,
          })
        ),
        totalCount: data.totalCount,
      }))
    );
  }

  getExternalEntites(data: EntityData) {
    return this.HTTP.getData<any>(MAIN_MJALES_API.LIST_EXTERNAL_MEMBERS, {
      SkipCount: data.page * data.maxResult,
      MaxResultCount: data.maxResult,
      name: data.search || '',
    });
  }

  addExternalMembers(data: Member) {
    return this.HTTP.sendData(MAIN_MJALES_API.CREATE_EXTERNAL_MEMBERS, data);
  }

  deleteExternalMember(id: string) {
    return this.HTTP.deleteData(MAIN_MJALES_API.DELETE_EXTERNAL_MEMBERS + id);
  }
}

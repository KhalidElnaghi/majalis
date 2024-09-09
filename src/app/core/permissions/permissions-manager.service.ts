import { Injectable, inject } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { HttpService } from '../services/http.service';

import { Resources as RESOURCE, Action as ACTION } from './auth-request.model';
import { Resource, Sub, SubjectTypes } from './auth-request.model';
import { MAIN_APP_API } from '../../modules/main-user/main.api';
import {
  DefaultAuthorizationResourceBuilder,
  DefaultAuthorizationsRequestBuilder,
} from './auth-request-builder';

@Injectable({
  providedIn: 'root',
})
export class PermissionsManagerService {
  authService = inject(AuthenticationService);
  HTTP = inject(HttpService);

  permissions: Map<string, boolean> = new Map([]);
  scopedPermissions: Map<string, boolean> = new Map([]);
  notAuthorized: Map<string, string> = new Map([]); // will be removed if not needed

  // #region Methods
  private generateSub() {
    const loginName = this.authService.userData['login-name'];
    const sub = new Sub().setKind(loginName, SubjectTypes.User);

    return sub;
  }

  private generateNonScopedPermissionRequest() {
    let authorizationsRequest = new DefaultAuthorizationsRequestBuilder()
      .buildSub(this.generateSub())
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource().setKind(RESOURCE.committee).setIgnoreExpresssion()
          )
          .addAction(ACTION.list)
          .addAction(ACTION.create)
          .addAction(ACTION.delete)
          .addAction(ACTION.edit)
          .setSeqNo(0)
      )
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committeeMember)
              .setIgnoreExpresssion()
          )
          .addAction(ACTION.create)
          .addAction(ACTION.delete)
          .setSeqNo(0)
      )
      .build();

    return authorizationsRequest;
  }

  private generatePermissionsForCommittee(committeeID: string) {
    let authorizationsRequest = new DefaultAuthorizationsRequestBuilder()
      .buildSub(this.generateSub())
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committeeMeeting)
              .addAttr(RESOURCE.committee, committeeID)
          )
          .addAction(ACTION.list)
          .addAction(ACTION.create)
          .addAction(ACTION.delete)
          .addAction(ACTION.edit)
          .addAction(ACTION.export)
          .addAction(ACTION.viewDetails)
          .addAction(ACTION.viewPolls)
          .setSeqNo(0)
      )
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committeeDocument)
              .addAttr(RESOURCE.committee, committeeID)
          )
          .addAction(ACTION.upload)
          .addAction(ACTION.preview)
          .addAction(ACTION.delete)
          .addAction(ACTION.list)
          .setSeqNo(0)
      )
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committeeMOM)
              .addAttr(RESOURCE.committee, committeeID)
          )
          .addAction(ACTION.upload)
          .addAction(ACTION.preview)
          .addAction(ACTION.delete)
          .addAction(ACTION.list)
          .setSeqNo(0)
      )
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committeeMeetingMOM)
              .addAttr(RESOURCE.committee, committeeID)
          )
          .addAction(ACTION.view)
          .addAction(ACTION.create)
          .setSeqNo(0)
      )
      .build();

    return authorizationsRequest;
  }

  private generatedynamicPermission(committeeID: string, action: ACTION) {
    let authorizationsRequest = new DefaultAuthorizationsRequestBuilder()
      .buildSub(this.generateSub())
      .addResource(
        new DefaultAuthorizationResourceBuilder()
          .buildObj(
            new Resource()
              .setKind(RESOURCE.committee)
              .addAttr(RESOURCE.committee, committeeID)
          )
          .addAction(action)
          .setSeqNo(0)
      )
      .build();

    return authorizationsRequest;
  }

  initNonScopedPermission(v: any) {
    if (v.results[RESOURCE.committee][ACTION.list] == true) {
      this.set(ACTION.list, RESOURCE.committee);
    }
    if (v.results[RESOURCE.committee][ACTION.create] == true) {
      this.set(ACTION.create, RESOURCE.committee);
    }
    if (v.results[RESOURCE.committee][ACTION.delete] == true) {
      this.set(ACTION.delete, RESOURCE.committee);
    }
    if (v.results[RESOURCE.committee][ACTION.edit] == true) {
      this.set(ACTION.edit, RESOURCE.committee);
    }

    // Committee members
    if (v.results[RESOURCE.committeeMember][ACTION.create] == true) {
      this.set(ACTION.create, RESOURCE.committeeMember);
    }
    if (v.results[RESOURCE.committeeMember][ACTION.delete] == true) {
      this.set(ACTION.delete, RESOURCE.committeeMember);
    }
  }

  initScopedPermission(v: any) {
    // Meeting
    if (v.results[RESOURCE.committeeMeeting][ACTION.list] == true) {
      this.setScoped(ACTION.list, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.create] == true) {
      this.setScoped(ACTION.create, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.delete] == true) {
      this.setScoped(ACTION.delete, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.edit] == true) {
      this.setScoped(ACTION.edit, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.export] == true) {
      this.setScoped(ACTION.export, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.viewDetails] == true) {
      this.setScoped(ACTION.viewDetails, RESOURCE.committeeMeeting);
    }
    if (v.results[RESOURCE.committeeMeeting][ACTION.viewPolls] == true) {
      this.setScoped(ACTION.viewPolls, RESOURCE.committeeMeeting);
    }

    // Documents
    if (v.results[RESOURCE.committeeDocument][ACTION.upload] == true) {
      this.setScoped(ACTION.upload, RESOURCE.committeeDocument);
    }
    if (v.results[RESOURCE.committeeDocument][ACTION.preview] == true) {
      this.setScoped(ACTION.preview, RESOURCE.committeeDocument);
    }
    if (v.results[RESOURCE.committeeDocument][ACTION.delete] == true) {
      this.setScoped(ACTION.delete, RESOURCE.committeeDocument);
    }
    if (v.results[RESOURCE.committeeDocument][ACTION.list] == true) {
      this.setScoped(ACTION.list, RESOURCE.committeeDocument);
    }

    // Meeting minutes attachments
    if (v.results[RESOURCE.committeeMOM][ACTION.upload] == true) {
      this.setScoped(ACTION.upload, RESOURCE.committeeMOM);
    }
    if (v.results[RESOURCE.committeeMOM][ACTION.preview] == true) {
      this.setScoped(ACTION.preview, RESOURCE.committeeMOM);
    }
    if (v.results[RESOURCE.committeeMOM][ACTION.delete] == true) {
      this.setScoped(ACTION.delete, RESOURCE.committeeMOM);
    }
    if (v.results[RESOURCE.committeeMOM][ACTION.list] == true) {
      this.setScoped(ACTION.list, RESOURCE.committeeMOM);
    }

    // // Meeting minutes form
    if (v.results[RESOURCE.committeeMeetingMOM][ACTION.view] == true) {
      this.setScoped(ACTION.view, RESOURCE.committeeMeetingMOM);
    }
    if (v.results[RESOURCE.committeeMeetingMOM][ACTION.create] == true) {
      this.setScoped(ACTION.create, RESOURCE.committeeMeetingMOM);
    }
  }

  getUserNonScopedPermissions() {
    return this.HTTP.sendData(
      MAIN_APP_API.PERMISSIONS,
      this.generateNonScopedPermissionRequest()
    );
  }

  getUserScopedPermissions(resourceID: string) {
    return this.HTTP.sendData(
      MAIN_APP_API.PERMISSIONS,
      this.generatePermissionsForCommittee(resourceID)
    );
  }

  getDynamicPermissionForActions(resourceId: string, action: ACTION) {
    return this.HTTP.sendData<
      any,
      { results: { committee: Record<string, boolean> } }
    >(
      MAIN_APP_API.PERMISSIONS,
      this.generatedynamicPermission(resourceId, action)
    );
  }

  // #region Actions
  private generateKey(action: ACTION, object: string) {
    return `${action.toString()}_${object.toString()}`;
  }

  private set(action: ACTION, object: string) {
    if (!this.permissions.has(this.generateKey(action, object))) {
      this.permissions.set(this.generateKey(action, object), true);
    }
  }

  private setScoped(action: ACTION, object: string) {
    if (!this.scopedPermissions.has(this.generateKey(action, object))) {
      this.scopedPermissions.set(this.generateKey(action, object), true);
    }
  }

  // will be removed if not needed
  private setUnauthorized(action: ACTION, object: string) {
    if (!this.notAuthorized.has(this.generateKey(action, object))) {
      this.notAuthorized.set(this.generateKey(action, object), '');
    }
  }

  can(action: ACTION, object: string, scoped: boolean): boolean {
    return scoped
      ? this.scopedPermissions.has(this.generateKey(action, object))
      : this.permissions.has(this.generateKey(action, object));
  }

  exist(action: ACTION, object: string): boolean {
    return (
      this.permissions.has(this.generateKey(action, object)) ||
      this.notAuthorized.has(this.generateKey(action, object))
    );
  }

  resetScopedPermissions() {
    this.scopedPermissions = new Map([]);
  }
}

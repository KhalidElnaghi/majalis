// #region Types
export enum Action {
  list = 'list',
  view = 'view',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
  preview = 'preview',
  upload = 'upload',
  export = 'export',
  viewDetails = 'view-details',
  viewPolls = 'view-polls',
}

export enum Resources {
  committee = 'committee',
  committeeMember = 'committee-member',
  committeeDocument = 'committee-document',
  committeeMOM = 'committee-mom',
  committeeMeeting = 'committee-meeting',
  committeeMeetingMOM = 'committee-meeting-mom',
}

export type PermissionKey = (action: Action, resource: Resources) => string;

export enum SubjectTypes {
  User = 'u',
  Role = 'r',
}

// #region Classes
export class AuthRequest {
  sub!: Sub;
  obj!: Resource;
  actions: String[] = [];
}

export class AuthorizationsRequest {
  sub!: Sub;
  resources: AuthResource[] = [];
}

export class AuthResource {
  obj!: Resource;
  seqNo!: number;
  actions: String[] = [];
}

export class Sub {
  kind!: String;
  attr: Record<string, any> = {};

  setKind(akind: string, type: SubjectTypes): Sub {
    this.kind = type.toString().concat(':', akind);
    return this;
  }

  addAttr(name: string, val: any): Sub {
    this.attr[name] = val;
    return this;
  }

  /* 
    Role and departments are not returned in the current loggedIn user data 
  */

  // departments: String[] = [];
  // roles: String[] = [];

  // addDepartment(name: string): Sub {
  //   if (name) this.departments.push(name);
  //   return this;
  // }

  // addRole(name: string): Sub {
  //   this.roles.push(SubjectTypes.Role.toString().concat(':', name));
  //   return this;
  // }
}

export class Resource {
  public kind!: Resources;
  public attr?: Record<string, any> = {};
  public ignoreExpression: boolean = false;

  setKind(akind: Resources): Resource {
    this.kind = akind;
    return this;
  }

  addAttr(name: string, val: any): Resource {
    this.attr![name] = val;
    return this;
  }

  setIgnoreExpresssion() {
    this.ignoreExpression = true;
    return this;
  }
}

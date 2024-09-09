import { AuthorizationsRequest, AuthRequest, AuthResource, Resource, Sub } from './auth-request.model';

export interface ISubBuilder {
  build(): Sub;
}

export interface IObjBuilder {
  build(): Resource;
}

export interface IAuthRequestBuilder {
  buildSub(sub: ISubBuilder | Sub): IAuthRequestBuilder;
  buildObj(obj: IObjBuilder | Resource): IAuthRequestBuilder;
  addAction(action: string): IAuthRequestBuilder;
  build(): AuthRequest;
}

export interface IAuthorizationsRequestBuilder {
  buildSub(sub: ISubBuilder | Sub): IAuthorizationsRequestBuilder;
  addResource(resource: IAuthorizationResourceBuilder): IAuthorizationsRequestBuilder;
  build(): AuthorizationsRequest;
}

export interface IAuthorizationResourceBuilder {
  buildObj(obj: IObjBuilder | Resource): IAuthorizationResourceBuilder;
  addAction(action: string): IAuthorizationResourceBuilder;
  build(): AuthResource;
}

export class DefaultAuthRequestBuilder implements IAuthRequestBuilder {
  authRequest: AuthRequest = new AuthRequest();

  buildSub(sub: ISubBuilder | Sub): DefaultAuthRequestBuilder {
    if (sub instanceof Sub) {
      this.authRequest.sub = sub;
    } else {
      this.authRequest.sub = sub.build();
    }
    return this;
  }

  buildObj(obj: IObjBuilder | Resource): DefaultAuthRequestBuilder {
    if (obj instanceof Resource) {
      this.authRequest.obj = obj;
    } else {
      this.authRequest.obj = obj.build();
    }

    return this;
  }

  addAction(action: string): DefaultAuthRequestBuilder {
    this.authRequest.actions.push(action);
    return this;
  }

  build(): AuthRequest {
    return this.authRequest;
  }
}

export class DefaultAuthorizationResourceBuilder implements IAuthorizationResourceBuilder {
  authResource: AuthResource = new AuthResource();

  buildObj(obj: IObjBuilder | Resource): DefaultAuthorizationResourceBuilder {
    if (obj instanceof Resource) {
      this.authResource.obj = obj;
    } else {
      this.authResource.obj = obj.build();
    }

    return this;
  }

  addAction(action: string): DefaultAuthorizationResourceBuilder {
    this.authResource.actions.push(action);
    return this;
  }

  setSeqNo(seqno: number): DefaultAuthorizationResourceBuilder {
    this.authResource.seqNo = seqno;
    return this;
  }

  build(): AuthResource {
    return this.authResource;
  }
}

export class DefaultAuthorizationsRequestBuilder implements IAuthorizationsRequestBuilder {
  authorizationsRequest: AuthorizationsRequest = new AuthorizationsRequest();

  buildSub(sub: ISubBuilder | Sub): DefaultAuthorizationsRequestBuilder {
    if (sub instanceof Sub) {
      this.authorizationsRequest.sub = sub;
    } else {
      this.authorizationsRequest.sub = sub.build();
    }
    return this;
  }

  addResource(resource: IAuthorizationResourceBuilder): DefaultAuthorizationsRequestBuilder {
    this.authorizationsRequest.resources.push(resource.build());
    return this;
  }

  build(): AuthorizationsRequest {
    return this.authorizationsRequest;
  }
}

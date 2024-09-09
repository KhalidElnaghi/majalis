import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { removeFalsyValues } from '../../shared/utils/data-transformation';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private HTTP = inject(HttpClient);

  getData<
    TResponse extends object = ServerResponse,
    TPaginate extends object = {},
    TFilter extends object = {}
  >(url: string, pagination?: TPaginate, filter?: TFilter) {
    const filterModel = filter && removeFalsyValues(filter);

    return this.HTTP.get<TResponse>(url, {
      params: { ...pagination, ...filterModel },
    });
  }

  getDataById<TResponse extends object = ServerResponse>(
    url: string,
    id: string
  ) {
    return this.HTTP.get<TResponse>(url + id);
  }

  getFiles(url: string) {
    return this.HTTP.get(url, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }

  sendData<TBody extends object, TResponse extends object = ServerResponse>(
    url: string,
    model: TBody,
    headers?: HttpHeaders,
    id?: string
  ) {
    return this.HTTP.post<TResponse>(id ? url + id : url, model, {
      headers,
    });
  }

  sendFile<TBody extends object, TResponse extends object = ServerResponse>(
    url: string,
    model: TBody,
    options?: any
  ) {
    return this.HTTP.post<TResponse>(url, model, options);
  }

  sendFiles<TBody extends object, TResponse extends object = ServerResponse>(
    url: string,
    reqBody: TBody,
    options?: any
  ) {
    return this.HTTP.post<TResponse>(url, reqBody, {
      enctype: 'multipart/form-data',
      reportProgress: true,
      observe: 'events',
      ...options,
    });
  }

  updateData<TMethod extends 'put' | 'patch', TBody extends object>(
    method: TMethod,
    url: string,
    model: TBody
  ) {
    return this.HTTP[method]<TBody>(url, model);
  }

  deleteData<TResponse extends ServerResponse>(
    url: string,
    params: Record<string, any> = {}
  ) {
    return this.HTTP.delete<TResponse>(url, { params });
  }
}

// TODO: Add generic type for server response items.
export type ServerResponse<T = unknown> = {
  totalCount: number;
  items: T[];
};

export type FilterModel = {
  [key: string]: unknown;
};

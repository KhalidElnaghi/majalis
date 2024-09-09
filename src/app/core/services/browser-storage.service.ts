import { Injectable } from '@angular/core';

import * as Crypto from 'crypto-js';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  private encrypt(value: string): string {
    return Crypto.AES.encrypt(
      value,
      environment.BROWSER_STORAGE_KEY
    ).toString();
  }

  private decrypt(value: string) {
    return Crypto.AES.decrypt(value, environment.BROWSER_STORAGE_KEY).toString(
      Crypto.enc.Utf8
    );
  }

  setData<T>(storage: 'local' | 'session', key: string, value: T) {
    let stringifiedValue = JSON.stringify(value);
    if (storage === 'local') {
      localStorage.setItem(key, this.encrypt(stringifiedValue));
    } else {
      sessionStorage.setItem(key, this.encrypt(stringifiedValue));
    }
  }

  getData(storage: 'local' | 'session', key: string) {
    let value;
    if (storage === 'local') {
      value = localStorage.getItem(key);
    } else {
      value = sessionStorage.getItem(key);
    }
    return value && JSON.parse(this.decrypt(value));
  }

  removeData(storage: 'local' | 'session', key: string) {
    if (storage === 'local') {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  clearData(storage: 'local' | 'session') {
    if (storage === 'local') {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  }

  clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
  }
}

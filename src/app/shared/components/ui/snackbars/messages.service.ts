import { Injectable, inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MessagesComponent } from './messages.component';

import { LayoutService } from '../../../../core/services/layout.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private snackBar = inject(MatSnackBar);
  private layout = inject(LayoutService);

  show(
    type: 'info' | 'error' | 'success' | 'warn',
    message: string,
    delay?: number
  ) {
    const snackBarData = { type, message };
    this.snackBar.openFromComponent(MessagesComponent, {
      data: snackBarData,
      duration: delay ? delay * 1000 : 0,
      panelClass: [`notification-${type}`],
      direction: this.layout.direction(),
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

export type MessageData = {
  type: 'info' | 'error' | 'success' | 'warn';
  message: string;
};

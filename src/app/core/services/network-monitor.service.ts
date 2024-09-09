import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Injectable, inject, signal } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';

import { NetworkIssueMessageComponent } from '../../shared/components/ui/network-issue-alert/network-issue-message.component';

import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkMonitorService {
  // NOTE: This service is reponsible for monitor network connection activity to display proper message for user, Better UX
  private layout = inject(LayoutService);
  private dialog = inject(MatDialog);

  private dialogRef!: MatDialogRef<NetworkIssueMessageComponent, any>;
  private isOnline = signal<boolean>(window.navigator.onLine);

  private open = () => {
    this.dialogRef = this.dialog.open(NetworkIssueMessageComponent, {
      disableClose: true,
      autoFocus: true,
      enterAnimationDuration: 250,
      exitAnimationDuration: 200,
      direction: this.layout.direction(),
      backdropClass: ['backdrop-blur-sm'],
      position: {
        top: '5rem',
      },
    });
  };

  private close = () => {
    this.dialogRef.close();
  };

  constructor() {
    if (!this.isOnline()) this.open();

    fromEvent(window, 'online')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isOnline.set(true);
        this.close();
      });

    fromEvent(window, 'offline')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isOnline.set(false);
        this.open();
      });
  }
}

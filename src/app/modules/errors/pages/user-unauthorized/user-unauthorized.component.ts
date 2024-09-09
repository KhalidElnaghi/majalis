import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'user-unauthorized',
  standalone: true,
  imports: [],
  template: ` <p>user-unauthorized works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserUnauthorizedComponent {}

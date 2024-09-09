import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
  signal,
} from "@angular/core";

import { errorMessages } from "./form-error-messages";

import { MatInput } from "@angular/material/input";
import {
  MatFormFieldControl,
  MatFormField,
} from "@angular/material/form-field";

import { TranslateModule } from "@ngx-translate/core";
import { startWith } from "rxjs";

@Component({
  selector: "[matErrorMessages]",
  standalone: true,
  imports: [TranslateModule],
  template: `<span class="font-normal text-xs">
    {{ error() | translate }}
  </span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMatErrorComponent {
  private injector = inject(Injector);

  private inputRef!: MatFormFieldControl<MatInput>;
  protected error = signal<string>("");

  ngAfterViewInit(): void {
    const container = this.injector.get(MatFormField);
    this.inputRef = container._control;

    if (this.inputRef) {
      this.inputRef.ngControl?.statusChanges
        ?.pipe(startWith("INVALID"))
        .subscribe((res) => {
          this.updateMessage(res, this.inputRef);
        });
    }
  }

  private updateMessage(
    status: "VALID" | "INVALID",
    ref: MatFormFieldControl<any>
  ) {
    const errors = ref.ngControl?.errors;
    if (status == "INVALID" && errors) {
      const firstError = Object.keys(errors)[0] as keyof typeof errorMessages;
      this.error.set(errorMessages[firstError]);
    } else {
      this.error.set("");
    }
  }
}

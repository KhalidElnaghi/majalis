import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const otherChoiceIsRequired: ValidatorFn = (
  topic: AbstractControl
): ValidationErrors | null => {
  if (topic) {
    const otherChoiceField = topic.get('otherChoiceField');
    const choiceField = topic.get('choiceField');
    if (topic.value.otherChoice) {
      const isOtherChoice = topic.value.choicesList.find(
        (choice: any) => choice.id == choiceField?.value
      )?.isOther;

      if (isOtherChoice && otherChoiceField && !otherChoiceField.value) {
        otherChoiceField?.setErrors({ required: true });
      } else {
        otherChoiceField?.setErrors(null);
      }
    } else {
      otherChoiceField?.setErrors(null);
    }
  }

  return null;
};

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  isPickedStartTimeValid,
  validateDate,
} from '../meeting-info-step/meeting-info-step.config';

const validTime = (time: string, date: string) => {
  if (!time) {
    return {
      voteTimeIsRequired: true,
    };
  }
  if (date && !isPickedStartTimeValid(time, date))
    return {
      invalidVoteTime: true,
    };
  return null;
};

export const voteDateTimeValidator: ValidatorFn = (
  agendaControl: AbstractControl
): ValidationErrors | null => {
  if (!agendaControl) return null;

  const startType = agendaControl.get('votingStartType');
  const startsAt = agendaControl.get('votingStartsAt');
  const startsAtTime = agendaControl.get('votingStartsAtTime');

  if (startType?.value !== 'Custom') {
    startsAt?.setErrors(null);
    startsAtTime?.setErrors(null);
    return null;
  }

  const dateErrors = validateDate(startsAt?.value || '');

  if (dateErrors) startsAt?.setErrors(dateErrors);

  // CLEAR ERRORS FROM DATE
  if (!dateErrors) startsAt?.setErrors(null);

  // TIME VALIDATIONS
  const timeErrors = validTime(
    startsAtTime?.value || '',
    startsAt?.value || ''
  );
  if (timeErrors) startsAtTime?.setErrors(timeErrors);

  // CLEAR ERRORS FROM START_TIME
  if (!timeErrors) startsAtTime?.setErrors(null);

  return null;
};

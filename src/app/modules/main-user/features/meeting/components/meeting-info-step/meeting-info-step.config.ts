import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { MessagesService } from '../../../../../../shared/components/ui/snackbars/messages.service';
import { MeetingsService } from '../../meetings.service';
import { DatePipe } from '@angular/common';
import { weekDays } from '../../../../main.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const meetingStepInfoResolver = (
  route: ActivatedRouteSnapshot
): Observable<unknown> => {
  const { meetingId } = route.queryParams;
  const meetingService = inject(MeetingsService);

  const messages = inject(MessagesService);
  return meetingService.getMeetingData(meetingId).pipe(
    catchError((error) => {
      messages.show('error', error.message);
      return throwError(() => error);
    })
  );
};

/**
  * - if date is being selected by the user then it should be ( Yesterday < Date >= Today )
  * - if date was already declared and being retrieved from the BACK-END then it might be an older-date
    so at this point i should only be checking if it is valid and not checking whether it's new or not
  * - the isNew flag will be set from the caller to identify the validation type
*/
export function isValidDate(date: string, isNew = true) {
  if (!isNaN(Date.parse(date)) && isNew) {
    return new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));
  }

  return (!isNaN(Date.parse(date)) && !isNew) || false;
}

export function getRepetitionValueType(
  type: string,
  weekDays: string[],
  isCustom: boolean
) {
  if (isCustom) return 'CUSTOM_VALUE';
  if (type === 'Weekly' && weekDays.length > 1) return 'Everyday';
  return type;
}
export function slugify(title: string) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\u0621-\u064Aa-z0-9\-]+/g, '')
    .replace(/^-+|-+$/g, '');
}
export function selectedMonthDetails(dateValue: string, datePipe: DatePipe) {
  const date = new Date(dateValue);
  return {
    monthName: datePipe.transform(date, 'MMMM')!,
    dayName: datePipe.transform(date, 'EEEE')! as weekDays[number],
    dayNumeric: date.getDate(),
  };
}

export function getTransformedDate(
  date: string | Date,
  datePipe: DatePipe,
  format = 'yyyy-MM-dd',
  locale = ''
) {
  return datePipe.transform(date, format, locale);
}
export function toLocaleTimeZone(date: string) {
  return date.indexOf('Z') !== -1 ? date : date + 'Z';
}
export function splitTime(time: string) {
  /*
   """"
   This function splits the time string into hours and minutes
   """"
   */
  return typeof time === 'string'
    ? time
        .split(':')
        .slice(0, 2)
        .map((e) => +e)
    : [];
}
export function isValidEndTime(startTimeDate: string, endTimeDate: string) {
  return new Date(endTimeDate) >= new Date(startTimeDate);
}
export function hasValidTimeDifference(timeOne: string, timeTwo: string) {
  /**
   """
   This function checks if the time difference between two times is valid.
   A valid time difference should be positive or 0.
   The function converts both times into minutes and calcs the difference
   """
   */
  const timeOneInMinutes =
    Number(timeOne.split(':')[0]) * 60 + Number(timeOne.split(':')[1]);
  const timeTwoInMinutes =
    Number(timeTwo.split(':')[0]) * 60 + Number(timeTwo.split(':')[1]);

  const difference = timeTwoInMinutes - timeOneInMinutes;
  return difference >= 0;
}

export function isPickedStartTimeValid(time: string, date: string) {
  /*
   """"
   This function checks if the picked time is valid.
   A valid time should be greater than the current time.
   If a picked date is not today then anytime should be valid
   """"
   */
  if (
    new Date(new Date(date).setHours(0, 0, 0, 0)) >
    new Date(new Date().setHours(0, 0, 0, 0))
  )
    return true;

  const pickedTime = [Number(time.split(':')[0]), Number(time.split(':')[1])];
  const dateWithPickedTime = new Date(
    new Date().setHours(pickedTime[0], pickedTime[1], 0)
  );

  return new Date(dateWithPickedTime) > new Date();
}

/*
----------------------------------------------------------------
  - All Validator Helper functions below are used to return single value each time
  - ex: if the date has a problem it will return only the current problem it has, same for startTime & endTime
----------------------------------------------------------------
*/
export const validateDate = (date: string): ValidationErrors | null => {
  if (!date) {
    return {
      required: true,
    };
  }

  if (!isValidDate(date, true)) {
    return {
      invalidDate: true,
    };
  }

  return null;
};

const validStartTime = (
  startTime: string,
  date: string,
  endTime: string
): ValidationErrors | null => {
  if (!startTime) {
    return {
      startTimeIsRequired: true,
    };
  }
  /*
    - Choosen time is after today's date current time
    - If date is not today, then any time is considered to be correct
  */
  if (date && !isPickedStartTimeValid(startTime, date))
    return {
      invalidStartTime: true,
    };

  // startTime Must be < endTime
  if (endTime && !hasValidTimeDifference(startTime ?? '', endTime ?? ''))
    return {
      startTimeIsGreater: true,
    };

  return null;
};

const validEndTime = (
  endTime: string,
  startTime: string
): ValidationErrors | null => {
  if (!endTime) {
    return {
      endTimeIsRequired: true,
    };
  }
  if (endTime && !hasValidTimeDifference(startTime ?? '', endTime ?? '')) {
    return {
      endTimeIsLess: true,
    };
  }

  return null;
};

export const dateAndTimeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control) {
    const startTime = control.get('startTime');
    const endTime = control.get('endTime');
    const date = control.get('date');

    // DATE VALIDATIONS
    const dateErrors = validateDate(date?.value);
    if (dateErrors) date?.setErrors(dateErrors);

    // CLEAR ERRORS FROM DATE
    if (!dateErrors) date?.setErrors(null);

    // START_TIME VALIDATIONS
    const startTimeErrors = validStartTime(
      startTime?.value,
      date?.value,
      endTime?.value
    );
    if (startTimeErrors) startTime?.setErrors(startTimeErrors);

    // CLEAR ERRORS FROM START_TIME
    if (!startTimeErrors) startTime?.setErrors(null);

    //  ===============================================

    //  END_TIME VALIDATIONS
    const endTimeErrors = validEndTime(endTime?.value, startTime?.value);

    if (endTimeErrors) endTime?.setErrors(endTimeErrors);

    // CLEAR ERRORS FROM ENDTIME
    if (!endTimeErrors) endTime?.setErrors(null);
  }

  return null;
};

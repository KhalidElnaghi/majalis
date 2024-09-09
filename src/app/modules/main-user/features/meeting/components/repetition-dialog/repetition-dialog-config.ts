import { AbstractControl, ValidationErrors } from '@angular/forms';
import { repeatitionDialogData, weekDays } from '../../../../main.types';

export enum RepetitionTypes {
  none = 'None',
  daily = 'Daily',
  weekly = 'Weekly',
  monthly = 'Monthly',
  yearly = 'Yearly',
}
export type StaticRepetitionTypes = RepetitionTypes | 'Everyday';

export const repetitionTypes: { name: string; value: string }[] = [
  {
    name: 'MAIN.OPTION.DAY',
    value: RepetitionTypes.daily,
  },
  {
    name: 'MAIN.OPTION.WEEK',
    value: RepetitionTypes.weekly,
  },
  {
    name: 'MAIN.OPTION.MONTH',
    value: RepetitionTypes.monthly,
  },
  {
    name: 'MAIN.OPTION.YEAR',
    value: RepetitionTypes.yearly,
  },
];

export const validateRepetition = (
  form: AbstractControl
): ValidationErrors | null => {
  const repetitionType = form.get('repetitionType');
  const repeatedDays = form.get('repeatedDays');
  const expireDate = form.get('expireDate');
  const end = form.get('end');
  if (
    repetitionType &&
    repetitionType?.value === 'week' &&
    repeatedDays?.value.length <= 0
  ) {
    repeatedDays?.setErrors({ required: true });
  } else {
    repeatedDays?.setErrors(null);
  }

  if (end && end?.value === 'date' && !expireDate?.value) {
    expireDate?.setErrors({ required: true });
  } else {
    expireDate?.setErrors(null);
  }

  return null;
};

export const dynamicFilterRepetitionData = (
  val: repeatitionDialogData,
  dayName: weekDays[number]
) => {
  const repetitionFilter = {
    None: () => ({
      type: 'None',
    }),
    Daily: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.daily,
      typeCount: val.typeCount,
      ...(val.end === 'date' &&
        val.endAt && { endAt: val.endAt, maxRepetitionCount: 0 }),
      ...(val.end === 'count' && {
        maxRepetitionCount: val.maxRepetitionCount,
        endAt: null,
      }),
      ...(val.end === 'never' && {
        endAt: null,
        maxRepetitionCount: 0,
      }),
      weekDays: [],
      isCustom: true,
    }),

    Weekly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.weekly,
      typeCount: val.typeCount,
      weekDays: val.weekDays,
      ...(val.end === 'date' &&
        val.endAt && { endAt: val.endAt, maxRepetitionCount: 0 }),
      ...(val.end === 'count' && {
        maxRepetitionCount: val.maxRepetitionCount,
        endAt: null,
      }),
      ...(val.end === 'never' && {
        endAt: null,
        maxRepetitionCount: 0,
      }),
      isCustom: true,
    }),

    Monthly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.monthly,
      typeCount: val.typeCount,
      day: dayName,
      ...(val.end === 'date' &&
        val.endAt && { endAt: val.endAt, maxRepetitionCount: 0 }),
      ...(val.end === 'count' && {
        maxRepetitionCount: val.maxRepetitionCount,
        endAt: null,
      }),
      ...(val.day === 'this-date' && { day: null }),
      ...(val.end === 'never' && {
        endAt: null,
        maxRepetitionCount: 0,
      }),
      weekDays: [],
      isCustom: true,
    }),

    Yearly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.yearly,
      typeCount: val.typeCount,
      ...(val.end === 'date' &&
        val.endAt && { endAt: val.endAt, maxRepetitionCount: 0 }),
      ...(val.end === 'count' && {
        maxRepetitionCount: val.maxRepetitionCount,
        endAt: null,
      }),
      ...(val.end === 'never' && {
        endAt: null,
        maxRepetitionCount: 0,
      }),
      day: null,
      weekDays: [],
      isCustom: true,
    }),
  };

  return repetitionFilter[val.type as RepetitionTypes]();
};

export const staticFilterRepetitionData = (
  val: StaticRepetitionTypes,
  dayName: weekDays[number]
) => {
  const fixedValues: Partial<repeatitionDialogData> = {
    isCustom: false,
    endAt: null,
    maxRepetitionCount: 0,
    typeCount: 1,
    day: null,
    weekDays: [],
  };
  const repetitionFilter = {
    None: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.none,
      ...fixedValues,
    }),
    Daily: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.daily,
      ...fixedValues,
    }),

    Weekly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.weekly,
      ...fixedValues,
      weekDays: [dayName] as Partial<weekDays>,
    }),
    Monthly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.monthly,
      ...fixedValues,
      day: dayName,
    }),

    Yearly: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.yearly,
      ...fixedValues,
    }),
    // NAME IS NOT COMING FROM BACKEND, IT"s CUSTOM VALUE FROM FE (SOKAR)
    Everyday: (): Partial<repeatitionDialogData> => ({
      type: RepetitionTypes.weekly,
      ...fixedValues,
      weekDays: [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ].filter((day) => {
        if (day === 'Saturday') return false;
        if (day === 'Friday') return false;
        return true;
      }) as Partial<weekDays>,
    }),
  };

  return repetitionFilter[val]();
};

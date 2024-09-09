import { LANG } from '../../../../../../core/services/translation.service';
import { BreadcrumbStructure } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { weekDays } from '../../../../main.types';
import { RepetitionTypes } from '../../components/repetition-dialog/repetition-dialog-config';

export const breadcrumbData = (committeeId: string): BreadcrumbStructure => [
  { path: '/main', title: 'MAIN.TITLE.COMMITTEES', icon: 'corporate_fare' },
  {
    path: `/main/committee/details`,
    queryParams: {
      committeeId: committeeId,
    },
    title: 'MAIN.LABEL.COMMITTEE_DETAILS',
  },
  { title: 'MAIN.TITLE.MEETING_DETAILS' },
];

export const pageTitle = {
  title: 'MAIN.TITLE.MEETING_DETAILS',
  subTitle: '',
};

const weekDaysCorrectOrder = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];
export const getRepetitionString = (
  type: RepetitionTypes,
  day: string | null,
  date: string,
  weekDays: Partial<weekDays>,
  isCustom: boolean,
  details: {
    dayName: weekDays[number];
    monthName: string;
    dayNumeric: number;
  },
  lang: LANG
): string[] => {
  let offset = '';
  if (details.dayNumeric > 0 && details.dayNumeric <= 7) {
    offset = 'First';
  } else if (+details.dayNumeric > 7 && +details.dayNumeric <= 14) {
    offset = 'Second';
  } else if (+details.dayNumeric > 14 && +details.dayNumeric <= 21) {
    offset = 'Third';
  } else {
    offset = 'Fourth';
  }
  const returnedString: { [key in RepetitionTypes]: () => string[] } = {
    [RepetitionTypes.none]: () => ['MAIN.TITLE.DO_NOT_REPEAT'],
    [RepetitionTypes.daily]: () => ['MAIN.TITLE.DAILY'],
    [RepetitionTypes.weekly]: () => {
      // IF CUSTOM, order weekdays, map them with their proper translations, reduce the mapped weekdays to add " - " between each day
      if (isCustom && weekDays.length >= 1) {
        const weekDaysUpperCase = weekDays
          .sort(
            (a, b) =>
              weekDaysCorrectOrder.indexOf(a!) -
              weekDaysCorrectOrder.indexOf(b!)
          )
          .map((day) => `GLOBAL.DAYS.${day?.toUpperCase()}`)
          .reduce(
            (acc, item, index) => {
              if (index < weekDays.length - 1) return [...acc, item, ' - '];
              return [...acc, item];
            },
            ['']
          );

        return [
          'MAIN.TITLE.WEEKLY_ON',
          '(',
          ...(weekDaysUpperCase as string[]).concat(')'),
        ];
      }

      // if not Custom return either the working-days or the selected day
      if (weekDays.length > 1) {
        return ['MAIN.TITLE.EVERY_WORKING_DAY'];
      }
      return [
        'MAIN.TITLE.WEEKLY_ON',
        `GLOBAL.DAYS.${details.dayName}`.toUpperCase(),
      ];
    },
    [RepetitionTypes.monthly]: () => {
      const onDate =
        lang === LANG.AR
          ? [`GLOBAL.DAYS.${details.dayName}`.toUpperCase(), offset]
          : [offset, `GLOBAL.DAYS.${details.dayName}`.toUpperCase()];

      if (!day) {
        return [
          'MAIN.TITLE.MONTHLY_ON_DAY',
          new Date(date).getDate().toString(),
        ];
      }
      return ['MAIN.TITLE.MONTHLY_ON_DAY', ...onDate];
    },
    [RepetitionTypes.yearly]: () => [
      'MAIN.TITLE.ANNUALLY_ON',
      `${details.dayNumeric}`,
      `GLOBAL.MONTHS.${details.monthName}`.toUpperCase(),
    ],
  };
  return returnedString[type]();
};

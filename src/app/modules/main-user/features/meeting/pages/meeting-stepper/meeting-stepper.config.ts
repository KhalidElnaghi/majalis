import { BreadcrumbStructure } from '../../../../../../shared/components/ui/breadcrumb/custom-breadcrumb.component';
import { LANG } from '../../../../../../core/services/translation.service';
import {
  staticFilterRepetitionData,
  RepetitionTypes,
} from '../../components/repetition-dialog/repetition-dialog-config';
import { Day } from '../../../../../../shared/types/global';
import { weekDays } from '../../../../main.types';

export const breadcrumbData = (committeeId: string): BreadcrumbStructure => [
  { path: '/main', title: 'MAIN.TITLE.COMMITTEES', icon: 'corporate_fare' },
  {
    path: `/main/committee/details`,
    queryParams: {
      committeeId: committeeId,
    },
    title: 'MAIN.LABEL.COMMITTEE_DETAILS',
  },
  { title: 'MAIN.TITLE.MEETING_CREATE' },
];

export const pageTitle = {
  title: 'MAIN.TITLE.MEETING_CREATE',
  subTitle: '',
};

export const Days: Day[] = [
  { value: 'Sunday', label: 'SU' },
  { value: 'Monday', label: 'MO' },
  { value: 'Tuesday', label: 'TU' },
  { value: 'Wednesday', label: 'WE' },
  { value: 'Thursday', label: 'TH' },
  { value: 'Friday', label: 'FR' },
  { value: 'Saturday', label: 'SA' },
];

export const repeatedOptions = (
  details: {
    dayName: weekDays[number];
    monthName: string;
    dayNumeric: number;
  },
  lang: LANG
) => {
  // THE OFFSET OF THE DAY IN THE MONTH
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

  return [
    {
      key: 'MAIN.TITLE.DO_NOT_REPEAT',
      type: RepetitionTypes.none,
      value: {
        ...staticFilterRepetitionData(RepetitionTypes.none, details.dayName),
      },
    },
    {
      key: 'MAIN.TITLE.DAILY',
      type: RepetitionTypes.daily,
      value: {
        ...staticFilterRepetitionData(RepetitionTypes.daily, details.dayName),
      },
    },
    {
      key: 'MAIN.TITLE.WEEKLY_ON',
      type: RepetitionTypes.weekly,
      value: {
        ...staticFilterRepetitionData(RepetitionTypes.weekly, details.dayName),
      },
      translation: [`GLOBAL.DAYS.${details.dayName}`.toUpperCase()],
    },
    {
      key: 'MAIN.TITLE.MONTHLY_ON_DAY',
      type: RepetitionTypes.monthly,
      value: {
        ...staticFilterRepetitionData(RepetitionTypes.monthly, details.dayName),
      },
      translation:
        lang === LANG.AR
          ? [`GLOBAL.DAYS.${details.dayName}`.toUpperCase(), offset]
          : [offset, `GLOBAL.DAYS.${details.dayName}`.toUpperCase()],
    },
    {
      key: 'MAIN.TITLE.ANNUALLY_ON',
      type: RepetitionTypes.yearly,
      value: {
        ...staticFilterRepetitionData(RepetitionTypes.yearly, details.dayName),
      },
      translation: [
        `${details.dayNumeric}`,
        `GLOBAL.MONTHS.${details.monthName}`.toUpperCase(),
      ],
    },
    {
      key: 'MAIN.TITLE.EVERY_WORKING_DAY',
      type: 'Everyday',
      value: { ...staticFilterRepetitionData('Everyday', details.dayName) },
    },
  ];
};

export const acceptableAttachments = [
  'pdf',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
];

export function isValidationOK(name: string, value: string) {
  if (name === 'title') {
    return value.trim().length >= 1;
  }
  if (name === 'description') {
    return value.trim().length >= 1;
  }
  if (name === 'location') {
    return value.trim().length >= 1;
  }

  return false;
}

export const urlRegExp =
  /((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?)/g;

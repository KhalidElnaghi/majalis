import {
  getTransformedDate,
  splitTime,
} from '../meeting-info-step/meeting-info-step.config';
import { DatePipe } from '@angular/common';

export function getCombinedDate(
  date: string,
  startTime: string,
  endTime: string,
  datePipe: DatePipe
) {
  const [startHours, startMinutes] = splitTime(startTime);
  const [endHours, endMinutes] = splitTime(endTime);

  const combinedDateAndStartTime = new Date(
    new Date(date).setHours(startHours, startMinutes, 0, 0)
  );
  const combinedDateAndEndTime = new Date(
    new Date(date).setHours(endHours, endMinutes, 0, 0)
  );
  const dateAndStartTime = getTransformedDate(
    combinedDateAndStartTime,
    datePipe,
    'yyyy-MM-ddTHH:mm',
    'UTC'
  );
  const dateAndEndTime = getTransformedDate(
    combinedDateAndEndTime,
    datePipe,
    'yyyy-MM-ddTHH:mm',
    'UTC'
  );
  return [dateAndStartTime, dateAndEndTime];
}

import { DateTime } from 'luxon';

export function convertDateToRelativeTime(date: Date) {
  return DateTime.fromJSDate(date).setLocale('en').toRelative();
}

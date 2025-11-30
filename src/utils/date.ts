import { format, formatDistance, formatRelative, isValid, parseISO, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

export type DateFormatPreset =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'date'
  | 'time'
  | 'datetime'
  | 'relative'
  | 'relativeShort';

export interface DateFormatOptions {
  preset?: DateFormatPreset;
  customFormat?: string;
  locale?: Locale;
}

const formatPresets: Record<DateFormatPreset, string> = {
  short: 'M/d/yy',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
  date: 'yyyy-MM-dd',
  time: 'HH:mm:ss',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  relative: 'relative',
  relativeShort: 'relativeShort',
};

export const formatDate = (
  date: Date | string | number,
  options: DateFormatOptions = {}
): string => {
  const { preset = 'medium', customFormat, locale = enUS } = options;

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    return '';
  }

  if (preset === 'relative') {
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale });
  }

  if (preset === 'relativeShort') {
    return formatRelative(dateObj, new Date(), { locale });
  }

  const formatString = customFormat || formatPresets[preset];
  return format(dateObj, formatString, { locale });
};

export const formatDateRange = (
  startDate: Date | string | number,
  endDate: Date | string | number,
  options: DateFormatOptions = {}
): string => {
  const start = formatDate(startDate, options);
  const end = formatDate(endDate, options);
  return `${start} - ${end}`;
};

export const isDateValid = (date: Date | string | number): boolean => {
  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  return isValid(dateObj);
};

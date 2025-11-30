import { computed, type Ref } from 'vue';
import { formatDate, formatDateRange, type DateFormatOptions, type DateFormatPreset } from '../utils/date';

export const useDateFormat = (date: Ref<Date | string | number> | Date | string | number) => {
  const dateRef = typeof date === 'object' && 'value' in date ? date : computed(() => date);

  const format = (options?: DateFormatOptions) => {
    return formatDate(dateRef.value, options);
  };

  const formatPreset = (preset: DateFormatPreset) => {
    return formatDate(dateRef.value, { preset });
  };

  const relative = () => {
    return formatDate(dateRef.value, { preset: 'relative' });
  };

  const relativeShort = () => {
    return formatDate(dateRef.value, { preset: 'relativeShort' });
  };

  const custom = (formatString: string) => {
    return formatDate(dateRef.value, { customFormat: formatString });
  };

  return {
    format,
    formatPreset,
    relative,
    relativeShort,
    custom,
  };
};

export const useDateRange = (
  startDate: Ref<Date | string | number> | Date | string | number,
  endDate: Ref<Date | string | number> | Date | string | number
) => {
  const startRef = typeof startDate === 'object' && 'value' in startDate ? startDate : computed(() => startDate);
  const endRef = typeof endDate === 'object' && 'value' in endDate ? endDate : computed(() => endDate);

  const format = (options?: DateFormatOptions) => {
    return formatDateRange(startRef.value, endRef.value, options);
  };

  return {
    format,
  };
};

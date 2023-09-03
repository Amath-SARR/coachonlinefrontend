export const localizeCurrency = (amount, currency = 'eur', options = { locale: 'fr-RF' }) =>
  new Intl.NumberFormat(options?.locale, {
    style: 'currency',
    currency: (currency || 'eur')?.toUpperCase(),
    minimumIntegerDigits: 1,
    minimumFractionDigits: 2,
  }).format(amount || 0);

export const isValidDate = (dateISO) => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', dateISO);
    return false;
  }
  return true;
};

export const localizeDate = (dateISO, locale = 'fr-Fr') => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', dateISO);
    return null;
  }
  return date.toLocaleDateString(locale);
};

export const getYear = (dateISO) => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', date);
    return null;
  }
  return Number(date.getFullYear());
};

export const getRealMonth = (dateISO) => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', date);
    return null;
  }
  return Number(date.getMonth()) + 1;
};

export const getDay = (dateISO) => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', date);
    return null;
  }
  return Number(date.getDate());
};

export const toMonthAndYear = (dateISO) => {
  const date = dateISO ? new Date(dateISO) : new Date();
  if (!date || !(date instanceof Date) || isNaN(date?.getTime())) {
    console.warn('Date is invalid', dateISO);
    return null;
  }
  const month = getRealMonth(dateISO);
  const monthString = month.toString();
  const year = getYear(dateISO);
  return `${monthString?.length > 1 ? monthString : `0${monthString}`}-${year}`;
};

export const getFirstDayOfWeek = () => {
  const dateNow = new Date();
  const currentDayOfWeek = dateNow.getDay();
  const currentDayOfMonth = dateNow.getDate();
  const weekDiff = currentDayOfMonth - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  return new Date(dateNow.setDate(weekDiff));
};
export const getFirstDayOfMonth = () => {
  const dateNow = new Date();
  const currentDayOfMonth = dateNow.getDate();
  const monthDiff = currentDayOfMonth - currentDayOfMonth + 1;
  return new Date(dateNow.setDate(monthDiff));
};

export const getFirstDayOfYear = () => {
  const firstDayOfCurrentMonth = getFirstDayOfMonth();
  return new Date(new Date().setFullYear(Number(new Date().getFullYear()) - 1));
};

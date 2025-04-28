export function getUtcDateTime(targetDate?: Date): Date {
  const date: Date = targetDate ? new Date(targetDate) : new Date();

  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  const utcHour = date.getUTCHours();
  const utcMinute = date.getUTCMinutes();
  const utcSecond = date.getUTCSeconds();

  return new Date(utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond);
}

export function getDateFromIndex(index: string): Date {
  const date = new Date();
  date.setFullYear(parseInt(index.substring(0, 4)));
  date.setMonth(parseInt(index.substring(4, 6)) - 1);
  date.setDate(parseInt(index.substring(6, 8)));

  return date;
}

export function getDateObject(targetDate?: Date | string | undefined): Date {
  if (!targetDate) {
    targetDate = getUtcDateTime();
  }

  if (typeof targetDate === 'string') {
    targetDate = new Date(targetDate);
  }

  const date = getUtcDateTime(targetDate);
  return new Date(date.getTime());
}

export function getIncrementalDateObject(increment: number): Date {
  const today = getDateObject();
  today.setDate(today.getDate() + increment);
  return getDateObject(today);
}

export function getDateIndex(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year + month + day;
}

export function getIncrementedDateIndex(increment: number): string {
  const today = getDateObject();
  today.setDate(today.getDate() + increment);
  return getDateIndex(today);
}

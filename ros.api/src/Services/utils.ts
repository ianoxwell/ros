import { CMessage } from '@base/message.class';

export function isMessage<T>(payload: CMessage | T): payload is CMessage {
  //magic happens here
  return (<CMessage>payload).message !== undefined;
}

export function convertDateIndexToDate(dateIndex: string): Date {
  return new Date(
    Date.UTC(
      parseInt(dateIndex.substring(0, 4), 10),
      parseInt(dateIndex.substring(4, 6), 10) - 1, // Months are 0-based
      parseInt(dateIndex.substring(6, 8), 10),
      0,
      0,
      0,
      0
    )
  );
}

export function getUtcDateTime(targetDate?: Date): Date {
  let date: Date;
  if (targetDate) {
    date = new Date(targetDate);
  } else {
    date = new Date();
  }

  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  const utcHour = date.getUTCHours();
  const utcMinute = date.getUTCMinutes();
  const utcSecond = date.getUTCSeconds();

  const utcDate = new Date(utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond);

  return utcDate;
}

export function getDateObject(targetDate?: Date): Date {
  const date = getUtcDateTime(targetDate);
  return new Date(date.getTime());
}

export function getDateIndex(date: Date): string {
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

export function getIncrementalDateFromTarget(targetDate?: Date, increment = 7): Date {
  const incDate = getDateObject(targetDate);
  incDate.setDate(targetDate.getDate() + increment);
  return incDate;
}

/** Gets a random whole number between min and max */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Generates a whole number between min and max inclusive
}

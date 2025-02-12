import { Injectable } from '@angular/core';
export interface IDateTimeModel {
  hour: number;
  minute: number;
  meriden: string;
  format: number;
}
@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  static readAbleDate(theDate: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return theDate.toLocaleTimeString('en-au', options);
  }
  public static addHours(date: Date, h: number): Date {
    const copiedDate = new Date(date);
    copiedDate.setHours(copiedDate.getHours() + h);
    return copiedDate;
  }
  public static addMonths(date: Date, m: number): Date {
    const copiedDate = new Date(date);
    copiedDate.setMonth(copiedDate.getMonth() + m);
    return copiedDate;
  }
  public static formatTime(date: Date): IDateTimeModel {
    let hours = date.getHours();
    const minutes = Math.round(date.getMinutes() / 5) * 5; // round to closest 5
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return { hour: hours, minute: minutes, meriden: ampm, format: 12 };
  }
  public static returnHours(field: any): number {
    return field.meriden === 'PM' && field.hour !== 12 ? field.hour + 12 : field.hour;
  }
  public static setBookingTime(setDate: Date, timeValue: any) {
    setDate.setHours(DateTimeService.returnHours(timeValue));
    setDate.setMinutes(timeValue.minute);
  }
  public static timeStringToDate(theDate: Date, hours: number, minutes: number, amPM: string): Date {
    if (amPM === 'PM') {
      hours += 12;
    }
    theDate.setHours(hours);
    theDate.setMinutes(minutes);
    return theDate;
  }
  public static dateAddHours(theDate: Date, h: number): Date {
    theDate.setHours(theDate.getHours() + h);
    return theDate;
  }
  public static dateLessThanToday(theDate: Date): boolean {
    return theDate.getTime() < new Date().getTime();
  }
  public static capitaliseFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  public static lowerCaseFirstLetter(word: string): string {
    return word.charAt(0).toLowerCase() + word.slice(1);
  }
  public static randomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  public static sortByNumber(a: any, b: any): number {
    if (a.preference === b.preference) {
      return 0;
    }
    return a.preference - b.preference;
  }
}

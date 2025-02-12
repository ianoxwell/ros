import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toTitleCase'
})
export class ToTitleCasePipe implements PipeTransform {
  transform(phrase: string): string {
    return phrase
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

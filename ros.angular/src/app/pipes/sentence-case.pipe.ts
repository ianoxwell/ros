import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sentenceCase',
    standalone: true
})
export class SentenceCasePipe implements PipeTransform {
  transform(word: string | undefined): string {
    if (!word) {
      return '';
    }

    return !word ? word : word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}

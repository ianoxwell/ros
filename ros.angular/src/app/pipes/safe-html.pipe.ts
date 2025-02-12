import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';

/**
 * Allows angular to bypass sanitizing input of html/scripts from text rendered within {{ }} tags.
 * Please... If you are using this, MAKE DAMN SURE that the html is actually safe and isn't input by users!!!
 * Primary uses - custom manipulation of strings, dynamically styling components based on business logic.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

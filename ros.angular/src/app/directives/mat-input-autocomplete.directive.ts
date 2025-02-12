import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[matInput]'
})
export class MatInputAutoCompleteDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocomplete', 'off');
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocorrect', 'off');
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocapitalize', 'none');
  }
}

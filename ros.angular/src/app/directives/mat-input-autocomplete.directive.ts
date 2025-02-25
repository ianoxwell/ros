import { Directive, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[matInput]',
  standalone: false
})
export class MatInputAutoCompleteDirective {
  constructor(
    @Inject(ElementRef<MatInput>) private elRef: ElementRef<MatInput>,
    private renderer: Renderer2
  ) {
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocomplete', 'off');
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocorrect', 'off');
    this.renderer.setAttribute(this.elRef.nativeElement, 'autocapitalize', 'none');
  }
}

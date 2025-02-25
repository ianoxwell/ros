import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-skip-to-main',
  templateUrl: './skip-to-main.component.html',
  styleUrls: ['./skip-to-main.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class SkipToMainComponent {
  pageTitleId = 'page-title-main-content';
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Scrolls the page to the main content section avoiding navigation elements.
   */
  skip(): void {
    const pageMainElement = this.document.getElementById('main');
    const focusableElements = pageMainElement?.querySelectorAll('button,a,input,select,textarea') || [];

    if (focusableElements.length) {
      (focusableElements[0] as HTMLElement).focus();
    } else {
      pageMainElement?.scrollIntoView();
      pageMainElement?.focus();
    }
  }
}

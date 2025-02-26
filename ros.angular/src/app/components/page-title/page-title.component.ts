import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SiteLogoComponent } from '@components/site-logo/site-logo.component';
import { PageTitleService } from '@services/page-title.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  imports: [A11yModule, CommonModule, MatIconModule, SiteLogoComponent]
})
export class PageTitleComponent {
  @Input() isLoginPage = false;
  pageTitle$: Observable<string>;
  pageSymbol$: Observable<string>;

  constructor(private pageTitleService: PageTitleService) {
    this.pageTitle$ = this.pageTitleService.pageTitle$;
    this.pageSymbol$ = this.pageTitleService.pageSymbol$;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from '@services/page-title.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  pageTitle$: Observable<string>;
  pageSymbol$: Observable<string>;
  isLoginPage = false;

  constructor(private pageTitleService: PageTitleService, private router: Router) {
    this.pageTitle$ = this.pageTitleService.pageTitle$;
    this.pageSymbol$ = this.pageTitleService.pageSymbol$;
  }

  ngOnInit() {
    const currentUrl: string = this.router.url;
    this.isLoginPage = currentUrl.includes('account') || this.router.url === '/';
  }
}

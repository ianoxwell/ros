import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IDictionary } from '@models/common.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CRouteList } from './route-list.const';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  urlHistory: string[] = [];
  pageUrlSubject$ = new BehaviorSubject<string>('');

  readonly routes = CRouteList;
  defaultUrl: string = this.routes.login;

  productDetailsContext = this.routes.products;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  /**
   * Listens for router / navigation end events and stores visited pages in history.
   * @returns the current route url as string.
   */
  listenToRouteEnd(): Observable<string> {
    if (!this.urlHistory.length) {
      console.log('current url', this.activatedRoute);
    }

    return this.router.events.pipe(
      // only listen for nav end
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter((event: any) => event instanceof NavigationEnd),
      map((route: NavigationEnd) => {
        console.log('navigation end', route);
        const url = route.urlAfterRedirects || route.url;
        this.urlHistory.push(url);
        this.pageUrlSubject$.next(url);
        return url;
      })
    );
  }

  /**
   * Navigates back a page if the user has visited a page previously.
   */
  navigateBack(altUrl?: string): void {
    if (this.urlHistory.length > 2) {
      this.urlHistory.pop(); // removes the current URL, no need to keep in history.
      const historyItem: string = this.urlHistory.pop() as string;
      this.router.navigateByUrl(historyItem);
    } else if (!!altUrl) {
      this.navigateToUrl(altUrl);
    }
  }

  /**
   * Translates the url into current language and navigates there.
   * @param url string in english to navigate to.
   */
  navigateToUrl(url: string, queryParams?: IDictionary<string>): void {
    this.router.navigate([url], { queryParams });
  }

  /**
   * Gets current page url.
   * @returns Observable of the page Url.
   */
  getPageUrl(): Observable<string> {
    return this.pageUrlSubject$.asObservable();
  }

  /** Calls on the window to open another blank tab. */
  navigateToExternalPage(url: string | undefined): void {
    if (!!url) {
      window.open(url, '_blank');
    }
  }
}

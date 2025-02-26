import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IUserSummary } from '@DomainModels/user.dto';
import { LoginService } from '@services/login/login.service';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { PageTitleService } from '@services/page-title.service';
import { Observable, of, timer } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { filterNullish } from 'src/app/utils/filter-nullish';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ]
})
export class AppHeaderComponent implements OnInit {
  profile: IUserSummary | null = null;
  currentUrl = '';
  pageTitle$: Observable<string>;
  pageSymbol$: Observable<string>;
  readonly routeList = CRouteList;

  mainMenuItems = [
    // commented out to improve completeness in the short term - add back in as features become available.
    // { link: '/savoury/shopping', icon: 'shopping_cart', text: 'Shopping List' },
    // { link: '/savoury/calendar', icon: 'book', text: 'Recipe Calendar' },
    { link: this.routeList.recipes, icon: 'assignment', text: 'Recipes' },
    { link: this.routeList.ingredients, icon: 'list_alt', text: 'Ingredients' }
  ];

  isLoggedIn = false;
  /** Delays navigation to ensure the rest of the logout events complete. */
  navigationDelayOnLogout = 1200;

  constructor(
    private userProfileService: UserProfileService,
    private loginService: LoginService,
    private navigationService: NavigationService,
    private pageTitleService: PageTitleService
  ) {
    this.listenCurrentRoute().subscribe();
    this.pageTitle$ = this.pageTitleService.pageTitle$;
    this.pageSymbol$ = this.pageTitleService.pageSymbol$;
  }

  ngOnInit(): void {
    this.initialProfileLoad().subscribe();
  }

  /** Listens to the current page route. */
  listenCurrentRoute(): Observable<string> {
    return this.navigationService.getPageUrl().pipe(tap((url: string) => (this.currentUrl = url)));
  }

  /** Listens for storage key jwt events to potentially trigger a logout. */
  listenForLogout(): Observable<string> {
    return this.loginService.listenStorageKeyJwtEvents();
  }

  /** On init of the app header - which always exists. */
  initialProfileLoad(): Observable<IUserSummary | null> {
    this.loginService.restoreJwt();

    return this.loginService.getAuthentication().pipe(
      map(() => {
        this.isLoggedIn = this.loginService.isAuthenticated();

        return this.isLoggedIn;
      }),
      // if not logged in, leave the userProfile alone, jwt is expired or doesn't exist.
      filter((actuallyLoggedIn: boolean) => actuallyLoggedIn),
      switchMap(() => this.userProfileService.getUserProfile()),
      switchMap((profile: IUserSummary | null) => {
        this.profile = profile;
        if (profile === null) {
          return this.loginService.getSingleUserProfile();
        }

        return of(profile);
      }),
      // On logout - profile is reverted to null - no need to keep going.
      filterNullish(),
      // delay to wait for the child routes to completely settle.
      delay(0),
      tap(() => {
        if (this.currentUrl.includes(this.routeList.account)) {
          this.navigationService.navigateToUrl(this.routeList.recipes);
        }
      })
    );
  }

  /**
   * Signs current user out.
   */
  signOut(): void {
    this.loginService.hardLogout(true);
    // ensure that the jwt and social auth have enough time to clear
    timer(this.navigationDelayOnLogout)
      .pipe(
        take(1),
        tap(() => this.navigationService.navigateToUrl(this.routeList.login))
      )
      .subscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { AdminRights } from '@models/common.model';
import { IUser } from '@models/user';
import { LoginService } from '@services/login/login.service';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { Observable, of, timer } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { filterNullish } from 'src/app/utils/filter-nullish';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  profile: IUser | null = null;
  currentUrl = '';
  readonly routeList = CRouteList;

  mainMenuItems = [
    // commented out to improve completeness in the short term - add back in as features become available.
    // { link: '/savoury/shopping', icon: 'shopping_cart', text: 'Shopping List' },
    // { link: '/savoury/calendar', icon: 'book', text: 'Recipe Calendar' },
    { link: this.routeList.recipes, icon: 'assignment', text: 'Recipes' },
    { link: this.routeList.ingredients, icon: 'list_alt', text: 'Ingredients' }
  ];

  adminRights: AdminRights = {
    globalAdmin: false,
    schoolAdmin: []
  };
  isLoggedIn = false;
  /** Delays navigation to ensure the rest of the logout events complete. */
  navigationDelayOnLogout = 1200;

  constructor(
    private userProfileService: UserProfileService,
    private loginService: LoginService,
    private navigationService: NavigationService
  ) {
    this.listenCurrentRoute().subscribe();
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
  initialProfileLoad(): Observable<IUser | null> {
    this.loginService.restoreJwt();

    return this.loginService.getAuthentication().pipe(
      map(() => {
        this.isLoggedIn = this.loginService.isAuthenticated();

        return this.isLoggedIn;
      }),
      // if not logged in, leave the userProfile alone, jwt is expired or doesn't exist.
      filter((actuallyLoggedIn: boolean) => actuallyLoggedIn),
      switchMap(() => this.userProfileService.getUserProfile()),
      switchMap((profile: IUser | null) => {
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
      tap((profile: IUser) => {
        this.adminRights = this.userProfileService.checkAdminRights(profile);
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

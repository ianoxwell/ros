import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResult } from '@models/common.model';
import { ITokenState } from '@models/logout.models';
import { IResponseToken, IToken } from '@models/security.models';
import { IUser } from '@models/user';
import { JwtHelperService } from '@services/jwt/jwt-helper.service';
import { ILocalUserJwt } from '@services/jwt/local-user-jwt.model';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CStorageKeys } from '../storage/storage-keys.const';
import { StorageService } from '../storage/storage.service';
import { UserProfileService } from '../user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authentication$ = new BehaviorSubject<ITokenState | null>(null);
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // JWT token string obtained at login.
  private jwt: IToken = this.initNewJwt();

  // Decoded token containing the authenticated user's claims.
  private claims: string[] | null = null;

  private readonly storageKeys = CStorageKeys;

  // State to do with the login timeout.
  private isTokenRefreshInProgress = false;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private userProfileService: UserProfileService,
    private authService: SocialAuthService,
    private jwtHelperService: JwtHelperService
  ) {
    // this.getSetJwtInitial();
  }

  getAuthentication(): Observable<ITokenState | null> {
    return this.authentication$.asObservable();
  }

  getClaims(): string[] | null {
    return this.claims;
  }

  /**
   * Gets the current subject containing the isLoggedIn. Only emits when it has value.
   * @returns Observable of the isLoggedIn items.
   */
  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  /**
   * Sets the subject with the isLoggedIn value.
   * @param value object or array of boolean
   */
  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn$.next(value);
  }

  isAuthenticated(): boolean {
    const jwtToken = this.getJwt();

    return (
      !!jwtToken &&
      jwtToken.length > 8 &&
      this.jwtHelperService.isTokenFresh<ILocalUserJwt>(jwtToken, 'exp') &&
      !!this.jwt.token
    );
  }

  // Clears login state.
  hardLogout(includeSocial = false): void {
    this.jwt = this.initNewJwt();
    this.claims = null;
    this.storageService.removeItem(this.storageKeys.tokenKey);
    if (includeSocial) {
      this.authService.authState
        .pipe(
          first(),
          filter((signedIn: SocialUser) => !!signedIn),
          tap(() => this.authService.signOut())
        )
        .subscribe();
      this.storageService.removeItem('google-user');
    }
    this.userProfileService.setLoggedIn(false);
    this.userProfileService.setUserProfile(null);
  }

  /**
   * Login Method - Gets both an access token and a refresh token
   * @param email the provided username
   * @param password the provided password
   */
  public login(email: string, password: string | null, social = false): Observable<MessageResult> {
    // Clear and current session
    this.hardLogout();

    // Construct the http request
    const body = social ? { email } : { email, password };
    const loginUrl = social
      ? `${environment.apiUrl}/token/google?email=${email}`
      : `${environment.apiUrl}${environment.apiVersion}token/create`;

    return this.http.post<IResponseToken>(loginUrl, body).pipe(
      map((resp: IResponseToken | MessageResult) => {
        if (Object.keys(resp).includes('message')) {
          throw resp;
        }

        const response = resp as IResponseToken;

        const jwt = this.processJwtResponse(response);
        this.userProfileService.setLoggedIn(true);
        const success = this.setJwt(jwt);
        return new MessageResult(success ? 'Successful login' : 'Login failure');
      })
    );
  }

  getSingleUserProfile(): Observable<IUser | null> {
    const jwtToken = this.getJwt();
    if (jwtToken === null) {
      return of(null);
    }

    const userId = this.jwtHelperService.decodeToken<ILocalUserJwt>(this.getJwt())?.sub;
    return this.http.get<IUser>(`${environment.apiUrl}${environment.apiVersion}account/get-account?id=${userId}`).pipe(
      tap((user: IUser) => {
        this.userProfileService.setUserProfile(user);
      })
    );
  }

  /* Refreshes the JWT if we're more than halfway through the token lifetime */
  sessionKeepAlive(): void {
    // If the refreshesAt is in the future, don't refresh.
    const tokenState = this.authentication$.value;

    if (!tokenState || tokenState.refreshesAt > Date.now()) {
      return;
    }

    this.refreshSession();
  }

  /**
   * Quick try parse string to JSON.
   * @param str to check.
   * @returns try if able to parse the string.
   */
  private isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Uses the Google User JWK as authorisation to attempt to sign username onto app.
   * @param googleUser can be SocialUser or string to parse (from the localStorage)
   * @returns boolean if successful or string message of 'register' if fail.
   */
  getTokenUsingGoogleToken(googleUser: SocialUser | string): Observable<boolean | string> {
    // check for string or Social User. Parse and cast to SocialUser.
    let gUser: SocialUser;
    if (typeof googleUser === 'string') {
      if (!this.isJsonString(googleUser)) {
        return of(false);
      } else {
        gUser = JSON.parse(googleUser) as SocialUser;
      }
    } else {
      gUser = googleUser;
    }
    let googleSignInUrl = `${environment.apiUrl}/token/google`;
    let newHeaders = new HttpHeaders();
    newHeaders = newHeaders.append('Content-Type', 'application/json');
    if (googleUser !== null) {
      newHeaders = newHeaders.append('Authorization', 'Bearer ' + gUser.idToken);
      googleSignInUrl += `?email=${gUser.email}`;
    }
    return this.http.get<IResponseToken>(googleSignInUrl, { headers: newHeaders }).pipe(
      map((resp: IResponseToken | MessageResult) => {
        // if the response is a message to register the user
        if (!!resp && Object.keys(resp).includes('message')) {
          throw 'register';
        }

        const response = resp as IResponseToken;
        const jwt = this.processJwtResponse(response);
        this.userProfileService.setLoggedIn(true);
        return this.setJwt(jwt);
      })
    );
  }

  /**
   * Access point for Reissuing the Jwt token
   */
  private refreshSession(): void {
    if (this.isTokenRefreshInProgress) {
      // Currently refreshing the token, don't want to do a double hit.
      return;
    }

    this.isTokenRefreshInProgress = true;

    // Retrieve the most current Jwt
    this.jwt.refreshToken = this.getJwtRefresh();

    // No Refresh Token?
    if (!this.jwt.refreshToken) {
      return;
    }

    // Posts the reissuing request
    this.postRefresh(this.jwt.refreshToken).subscribe(
      () => (this.isTokenRefreshInProgress = false),
      () => (this.isTokenRefreshInProgress = false)
    );
  }

  /**
   * Common method for getting access and refresh tokens
   */
  private postRefresh(rToken: string): Observable<boolean> {
    // Construct the http request
    const username = this.decodeLocalUserToken()?.email;
    const body = { refreshToken: rToken, username };
    const loginUrl = `${environment.apiUrl}${environment.apiVersion}token/refresh`;

    return this.http.post<IResponseToken>(loginUrl, body).pipe(
      map((response) => {
        const jwt = this.processJwtResponse(response);
        this.userProfileService.setLoggedIn(true);
        return this.setJwt(jwt);
      }),
      catchError((error: unknown) => {
        console.log('post Refresh in login', error);
        return of<boolean>(false);
      })
    );
  }

  /**
   * The common method for processing the new JWT (login and refresh)
   */
  private processJwtResponse(response: IResponseToken): IToken {
    let newJwt = this.initNewJwt();

    // Successful if there is a JWT Response
    if (!!response) {
      const expiresIn = response.expiresIn || 0;
      const lifetime = expiresIn * 1000; // Convert to millisecons.
      const expiresAt = Date.now() + lifetime;
      newJwt = {
        token: !!response.token ? response.token : '',
        refreshToken: !!response.refreshToken ? response.refreshToken : '',
        lifetime,
        expiresAt
      };
    }

    return newJwt;
  }

  /** Decodes the JWT Token roles */
  public decodeRoles(token: string): string[] | null {
    if (token === null || token.length < 8) {
      return null;
    }

    // Decode encrypted token
    const d = this.jwtHelperService.decodeToken<ILocalUserJwt>(token);

    return d.roles;
  }

  public decodeLocalUserToken(): ILocalUserJwt {
    return this.jwtHelperService.decodeToken<ILocalUserJwt>(this.getJwt());
  }

  /** 'Installs' a new JWT */
  private setJwt(newJwt: IToken): boolean {
    // Default
    if (!newJwt.token || !newJwt.refreshToken || !newJwt.expiresAt) {
      this.claims = null;

      this.jwt = this.initNewJwt();

      this.storeJwt(this.jwt);

      // Trigger Activity Change.
      this.authentication$.next(null);

      return false;
    }

    // Set token properties
    this.jwt = newJwt;

    this.storeJwt(this.jwt);

    const expiresAt = newJwt.expiresAt;
    const lifetime = newJwt.lifetime;

    const refreshesAt = expiresAt - Math.floor(lifetime / 2);
    const warnsAt = expiresAt - Math.floor(lifetime / 4);

    this.authentication$.next({ expiresAt, refreshesAt, warnsAt });

    this.claims = this.decodeRoles(this.jwt.token);

    // Google Analytics - Requires UserId
    // (window as any).ga('set', 'userId', this.claims.sub);

    return true;
  }

  /**
   * Initialises a new Jwt Object
   */
  private initNewJwt(): IToken {
    return {
      token: '',
      refreshToken: '',
      expiresAt: 0,
      lifetime: 0
    };
  }

  /** On startup of the app restores the initial JWT, if it is found in storage. */
  listenStorageKeyJwtEvents(): Observable<string> {
    // Observe the session for expiry changes from other tabs.
    return this.storageService.observeStorageEventItem(this.storageKeys.expiryKey).pipe(
      distinctUntilChanged(),
      tap(() => this.restoreJwt())
    );
  }

  /** Restores the JWT from session storage. */
  restoreJwt(): void {
    this.setJwt({
      token: this.getJwt(),
      refreshToken: this.getJwtRefresh(),
      expiresAt: this.getJwtExpiry(),
      lifetime: this.getJwtExpiry() - Date.now()
    });
  }

  // #region Storage Setters/Getters
  /** Saves the JWT token details in storage */
  private storeJwt(jwt: IToken): void {
    this.storageService.setItem(this.storageKeys.tokenKey, jwt.token);
    this.storageService.setItem(this.storageKeys.refreshKey, jwt.refreshToken);
    this.storageService.setItem(this.storageKeys.expiryKey, jwt.expiresAt.toString());
  }

  /** Gets the JWT Token from storage */
  public getJwt(): string {
    return this.storageService.getItem<string>(this.storageKeys.tokenKey) as string;
  }

  /** Gets the JWT refresh token from storage */
  private getJwtRefresh(): string {
    return this.storageService.getItem(this.storageKeys.refreshKey) as string;
  }

  /** Gets the JWT expiry time from storage */
  private getJwtExpiry(): number {
    return parseInt(this.storageService.getItem(this.storageKeys.expiryKey) as string, 10);
  }
}

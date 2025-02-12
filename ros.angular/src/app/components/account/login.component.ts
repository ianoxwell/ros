import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { MessageStatus } from '@models/message.model';
import { HttpStatusCode } from '@models/security.models';
import { DialogService } from '@services/dialog.service';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { CStorageKeys } from '@services/storage/storage-keys.const';
import { StorageService } from '@services/storage/storage.service';
// import { AuthenticationService } from '../../services/authentication.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ComponentBase implements OnInit {
  googleUserData: SocialUser | undefined;
  loggedIn = false;
  isGettingJwt = false;
  private readonly storageKeys = CStorageKeys;

  constructor(
    private authService: SocialAuthService,
    private dialogService: DialogService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private storageService: StorageService
  ) {
    super();
  }

  ngOnInit(): void {
    const gUser: string = this.storageService.getItem(this.storageKeys.googleUser) as string;
    // if GoogleJwtToken checks out then we proceed to authenticate.
    if (!!gUser && gUser.length > 0 && gUser !== 'null') {
      // attempt to verify the token against the api
      this.getGoogleJwtToken(gUser);
    } else {
      this.listenAuthState();
    }
  }

  /** Listens to the authService for the Social AuthService from angularx-social-login */
  listenAuthState(): void {
    this.authService.authState
      .pipe(
        tap((user: SocialUser) => {
          this.messageService.add({
            severity: MessageStatus.Success,
            summary: 'Authentication Successful',
            detail: 'Google Account Authenticated, attempting to logon to app.'
          });
          if (!!user) {
            this.googleUserData = user;
            this.storageService.setItem('google-user', JSON.stringify(this.googleUserData));

            this.getGoogleJwtToken(this.googleUserData);
          } else {
            this.storageService.removeItem('google-user');
          }

          this.loggedIn = user != null;
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          return this.dialogService.confirm(MessageStatus.Alert, 'Error on Google login attempt', err.message);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  /** Gets the JWT from the API using the Google Token for authentication. */
  getGoogleJwtToken(gUser: SocialUser | string): void {
    this.isGettingJwt = true;
    this.loginService
      .getTokenUsingGoogleToken(gUser)
      .pipe(
        tap((response: boolean | string) => {
          this.isGettingJwt = false;
          if (!!response && typeof response === 'string') {
            this.dialogService.confirm(
              MessageStatus.Information,
              'Registration required',
              `We currently don't have an account registered to that address.`
            );
            this.router.navigate(['/account/register']);
          } else {
            this.router.navigate(['/savoury/recipes']);
          }
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;

          if (err.status === HttpStatusCode.Forbidden && err.statusText === 'OK') {
            this.dialogService.confirm(
              MessageStatus.Alert,
              '403 response',
              'Likely the cached google token has expired, try refreshing browser and logging in with your Google account again.'
            );
            this.googleClear();
          }
          this.dialogService.alert('Google Login Error', err.message);
          this.isGettingJwt = false;
          return of();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
  /** sets the localStorage cache of the google-user to null */
  googleClear(): void {
    this.storageService.removeItem(this.storageKeys.googleUser);
  }
}

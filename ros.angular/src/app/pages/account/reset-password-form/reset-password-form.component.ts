import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { TokenStatus } from '@models/common.enum';
import { MessageResult } from '@models/common.model';
import { MessageStatus } from '@models/message.model';
import { ValidationMessages } from '@models/static-variables';
import { AccountService } from '@services/account.service';
import { MessageService } from '@services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['../login.component.scss'],
    standalone: false
})
export class ResetPasswordFormComponent extends ComponentBase implements OnInit {
  form: UntypedFormGroup;
  validationMessages = ValidationMessages;

  TokenStatus = TokenStatus;
  currentTokenStatus: Observable<TokenStatus> = of(TokenStatus.Validating);
  token: string | undefined;
  email: string | undefined;
  isSubmitting = false;
  isLoading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {
    super();
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // tslint:disable-next-line: no-string-literal
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.currentTokenStatus = this.resolveTokenStatus();
  }

  /**
   * resolves the token status from the token in the queryParam
   * @returns observable of the tokenStatus.
   */
  resolveTokenStatus(): Observable<TokenStatus> {
    return this.token === undefined || this.email === undefined
      ? of(TokenStatus.Invalid)
      : this.accountService.validateResetToken(this.token, this.email).pipe(
          first(),
          map((result: MessageResult) => this.validateResetTokenResult(result)),
          catchError((error: unknown) => {
            const err = error as HttpErrorResponse;
            return this.catchErrorMessage(
              'Reset Token Error',
              `The server did not receive a correctly formatted token. ${err.message}`
            );
          })
        );
  }

  /**
   *
   * @param result
   * @param token string reset token
   */
  validateResetTokenResult(result: MessageResult): TokenStatus {
    if (result.message === 'Invalid Token') {
      this.messageService.add({
        severity: MessageStatus.Error,
        summary: 'Invalid Token',
        detail: 'Please obtain a new password reset token.',
        life: 8000
      });
      return TokenStatus.Invalid;
    } else {
      return TokenStatus.Valid;
    }
  }

  get fPassword(): UntypedFormControl {
    return this.form.get('password') as UntypedFormControl;
  }

  /**
   * Creates form.
   * @returns FormGroup for password required.
   */
  createForm(): UntypedFormGroup {
    // Create the controls for the reactive forms
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  /**
   * Triggers the password reset pathway.
   */
  resetPassword(): void {
    if (this.form.invalid || !this.token || !this.email) {
      return;
    }
    this.isSubmitting = true;
    this.accountService
      .resetPassword(this.token, this.email, this.fPassword.value, this.fPassword.value)
      .pipe(
        first(),
        tap((result: MessageResult) => this.resetPasswordResult(result)),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          return this.catchErrorMessage('Password reset Error', err.message);
        })
      )
      .subscribe();
  }

  /**
   * Processes the result of the password reset.
   * @param result returned MessageResult from the resetPassword api endpoint.
   */
  resetPasswordResult(result: MessageResult): void {
    this.isSubmitting = false;
    if (result.message === 'Success') {
      this.messageService.add({
        severity: MessageStatus.Success,
        summary: 'Password reset',
        detail: 'Password reset you can now login with your new password.',
        life: 8000
      });
      this.router.navigate(['/account/login']);
    } else {
      this.messageService.add({
        severity: MessageStatus.Warning,
        summary: 'Password reset failed',
        detail: result.message,
        life: 8000
      });
    }
  }

  /**
   * Generic catch Error message.
   * @param summary string for the summary in the message.
   * @param detail detail in the message.
   * @returns observable of the Token Status - in this case invalid.
   */
  catchErrorMessage(summary: string, detail: string): Observable<TokenStatus> {
    this.messageService.add({
      severity: MessageStatus.Error,
      summary,
      detail,
      life: 8000
    });
    return of(TokenStatus.Invalid);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailStatus } from '@models/common.enum';
import { MessageResult } from '@models/common.model';
import { Message, MessageStatus } from '@models/message.model';
import { AccountService } from '@services/account.service';
import { MessageService } from '@services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;
  token: string | undefined;

  addMessages: { [key: string]: Message } = {
    emailVerifiedSuccess: {
      severity: MessageStatus.Success,
      summary: 'Email Verified',
      detail: 'Well done, email verified, please login to start making amazing recipes.',
      life: 8000
    },
    tokenUndefined: {
      severity: MessageStatus.Error,
      summary: 'Invalid Token',
      detail: 'Please obtain a new verify token.',
      life: 8000
    },
    verificationFailed: {
      severity: MessageStatus.Error,
      summary: 'Invalid Token',
      detail: 'Please obtain a new password reset token.',
      life: 8000
    },
    catchErrorFail: {
      severity: MessageStatus.Error,
      summary: 'Invalid Token',
      detail: 'Please obtain a new password reset token.',
      life: 8000
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // tslint:disable-next-line: no-string-literal
    this.token = this.route.snapshot.queryParams['token'];

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.verifyToken();
  }

  /**
   * Checks token for definition and then verifies token in api.
   */
  verifyToken(): void {
    if (this.token === undefined) {
      this.emailStatus = EmailStatus.Failed;
      this.messageService.add(this.addMessages.tokenUndefined);
    } else {
      this.accountService
        .verifyEmail(this.token)
        .pipe(
          first(),
          tap((result: MessageResult) => this.verifyTokenResult(result)),
          catchError(() => this.catchError())
        )
        .subscribe();
    }
  }

  /**
   * Processes the result of the verify token api.
   * @param result Message result - possibly verification failed.
   */
  verifyTokenResult(result: MessageResult): void {
    if (result.message === 'Verification Failed') {
      this.messageService.add(this.addMessages.verificationFailed);
      this.emailStatus = EmailStatus.Failed;
    } else {
      this.messageService.add(this.addMessages.emailVerifiedSuccess);
      this.router.navigate(['/account/login']);
    }
  }

  /**
   * Processes the catch error from the api.
   * @param error Error message from api.
   * @returns Observable.
   */
  catchError(): Observable<void> {
    this.messageService.add(this.addMessages.catchErrorFail);
    this.emailStatus = EmailStatus.Failed;
    return of();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { MessageResult } from '@models/common.model';
import { MessageStatus } from '@models/message.model';
import { ValidationMessages } from '@models/static-variables';
import { AccountService } from '@services/account.service';
import { MessageService } from '@services/message.service';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends ComponentBase implements OnInit {
  form: FormGroup;
  validationMessages = ValidationMessages;
  showLookInYourEmail = false;
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.form = this.createForm();
  }

  ngOnInit() {
    // tslint:disable-next-line: no-string-literal
    const resetEmail = this.route.snapshot.queryParams['email'];
    if (resetEmail !== undefined) {
      // remove email from url to be clean
      this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
      this.f.email.setValue(resetEmail);
      this.f.email.markAsTouched();
      this.f.email.markAsDirty();
    }
  }

  get f() {
    return this.form.controls;
  }
  createForm(): FormGroup {
    // Create the controls for the reactive forms
    return this.fb.group({
      email: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120), Validators.email]]
    });
  }

  forgotPassword(): void {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.accountService
      .forgotPassword(this.form.getRawValue().email)
      .pipe(
        tap((result: MessageResult) => {
          if (result.message === 'Please login through your Google Account') {
            this.messageService.add({
              severity: MessageStatus.Warning,
              summary: 'No Password to reset',
              detail: result.message,
              life: 8000
            });
            this.f.email.setErrors({ googleLogin: true });
            this.cdr.markForCheck();
            this.form.updateValueAndValidity();
          } else {
            this.showLookInYourEmail = true;
          }
          this.isSubmitting = false;
          console.log('email send result', result, this.isSubmitting);
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          if (err.status === 400) {
            this.messageService.add({
              severity: MessageStatus.Error,
              summary: 'Email Error',
              detail: 'The server did not receive a correctly formatted email address.',
              life: 8000
            });
          }
          if (err.status === 404) {
            this.messageService.add({
              severity: MessageStatus.Warning,
              summary: 'No Email account found',
              detail: err.error.message,
              life: 8000
            });
            this.f.email.setErrors({ registrationRequired: true }, { emitEvent: true });
            this.cdr.markForCheck();
          }
          this.isSubmitting = false;
          return of();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((thing) => {
        console.log('we got to the subscribe conclusion?', thing, this.isSubmitting);
        this.isSubmitting = false;
      });
  }
}

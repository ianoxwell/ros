import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { INewUser, NewUser } from '@models/accounts.model';
import { MessageResult } from '@models/common.model';
import { MessageStatus } from '@models/message.model';
import { ValidationMessages } from '@models/static-variables';
import { AccountService } from '@services/account.service';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { StorageService } from '@services/storage/storage.service';
import { SocialUser } from 'angularx-social-login';
import { of } from 'rxjs';
import { catchError, filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent extends ComponentBase implements OnInit {
  form: FormGroup = new FormGroup({});
  newUser: INewUser = new NewUser();
  validationMessages = ValidationMessages;

  displayAwaitingVerificationEmail = false;
  isSubmitting = false;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private loginService: LoginService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    const googleUser: string = this.storageService.getItem('google-user') as string;
    if (!!googleUser) {
      const gUser: SocialUser = JSON.parse(googleUser) as SocialUser;
      this.newUser =
        !!gUser && gUser !== null
          ? {
              firstName: gUser.firstName,
              lastName: gUser.lastName,
              email: gUser.email,
              loginProvider: gUser.provider,
              loginProviderId: gUser.id,
              photoUrl: gUser.photoUrl,
              verified: new Date()
            }
          : new NewUser();
    }
    this.createForm(this.newUser);
  }
  get f() {
    return this.form.controls;
  }

  createForm(user: INewUser): void {
    this.form = this.formBuilder.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      acceptTerms: [false, Validators.requiredTrue]
    });
    if (this.newUser.loginProvider !== 'GOOGLE') {
      this.form.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6)]));
    } else {
      this.f.email.disable();
    }
  }

  register(): void {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    const formValues = this.form.getRawValue();
    this.newUser.firstName = formValues.firstName;
    this.newUser.lastName = formValues.lastName;
    this.newUser.email = formValues.email;
    if (this.newUser.loginProvider !== 'GOOGLE') {
      this.newUser.password = formValues.password;
    }
    console.log('register the form', this.form.getRawValue(), this.newUser);
    this.accountService
      .register(this.newUser)
      .pipe(
        first(),
        filter((result: MessageResult) => {
          this.isSubmitting = false;
          console.log('isSubmitting', this.isSubmitting);
          if (result.message === 'Email address is already registered') {
            // set error on register account
            this.messageService.add({
              severity: MessageStatus.Warning,
              summary: 'Email Conflict',
              detail: 'It seems this email account is already registered with us.',
              life: 12000
            });
            this.f.email.setErrors({ emailConflict: true });
            return false;
          } else if (this.newUser.loginProvider === 'GOOGLE') {
            return true;
          }
          this.displayAwaitingVerificationEmail = true;
          return false;
        }),
        switchMap(() => this.loginService.login(this.newUser.email, null, true)),
        filter((authenticated: MessageResult) => authenticated.message === 'Successful login'),
        tap(() => this.router.navigate(['/savoury/browse'])),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          this.isSubmitting = false;
          this.messageService.add({
            severity: MessageStatus.Error,
            summary: 'Something terrible happened',
            detail: err.message,
            life: 12000
          });
          return of();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.isSubmitting = false;
        console.log('subscription finished', this.isSubmitting);
      });
  }
}

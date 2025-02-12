import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenStatus } from '@models/common.enum';
import { IDictionary, MessageResult } from '@models/common.model';
import { MessageStatus } from '@models/message.model';
import { AccountService } from '@services/account.service';
import { MessageService } from '@services/message.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { of, Subject } from 'rxjs';
import { ResetPasswordFormComponent } from './reset-password-form.component';

describe('ResetPasswordFormComponent', () => {
  let component: ResetPasswordFormComponent;
  let fixture: ComponentFixture<ResetPasswordFormComponent>;

  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);
  const accountServiceSpy: Spy<AccountService> = autoSpy(AccountService);
  accountServiceSpy.validateResetToken.and.returnValue(of());

  const activatedRouteSpy: Spy<ActivatedRoute> = autoSpy(ActivatedRoute);
  activatedRouteSpy.snapshot = { routeConfig: { url: '', path: '' } } as unknown as ActivatedRouteSnapshot;
  activatedRouteSpy.params = of({});
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        token: 'test'
      },
      paramMap: {
        get(): IDictionary<string> {
          return { token: 'test' };
        }
      },
      routeConfig: { url: '', path: '' }
    }
  } as unknown as ActivatedRoute;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([{ path: 'account/login', component: ResetPasswordFormComponent }]),
          MatCardModule,
          MatIconModule,
          NoopAnimationsModule
        ],
        declarations: [ResetPasswordFormComponent],
        providers: [
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: AccountService, useValue: accountServiceSpy },
          { provide: ActivatedRoute, useValue: fakeActivatedRoute }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reset password form', () => {
    beforeEach(() => {
      component.form = component.createForm();
    });

    it('should create a form with one empty required field', () => {
      expect(component.form.touched).toBeFalse();
      expect(component.form.valid).toBeFalse();

      component.form.get('password').setValue('testing');
      expect(component.form.valid).toBeTrue();
    });

    it('should not allow a password with less than 6 characters', () => {
      expect(component.form.valid).toBeFalse();

      component.form.get('password').setValue('test');
      expect(component.form.valid).toBeFalse();
    });
  });

  describe('Reset-password token', () => {
    it('should set tokenStatus to invalid for undefined token', (done: DoneFn) => {
      component.token = undefined;
      let result = undefined;
      component.resolveTokenStatus().subscribe((status: TokenStatus) => {
        result = status;
        expect(result).toEqual(TokenStatus.Invalid);
        done();
      });
    });

    it('should set tokenStatus to invalid for an api declared invalid token otherwise valid', () => {
      let tokenResult = component.validateResetTokenResult({ message: 'Invalid Token' });
      expect(tokenResult).toEqual(TokenStatus.Invalid);

      tokenResult = component.validateResetTokenResult({ message: 'Valid Token' });
      expect(messageServiceSpy.add).toHaveBeenCalled();
      expect(tokenResult).toEqual(TokenStatus.Valid);
    });
  });

  it('resetPassword should return void for invalid form', () => {
    component.form = component.createForm();
    const rPassword = component.resetPassword();
    expect(rPassword).toBeUndefined();
  });

  describe('Reset password', () => {
    let subject: Subject<MessageResult>;

    beforeEach(() => {
      subject = new Subject<MessageResult>();
      accountServiceSpy.resetPassword.and.returnValue(subject.asObservable());
      component.form = component.createForm();
      component.form.get('password').setValue('testing');
      component.resetPassword();
    });

    it('should send a success message', () => {
      expect(component.isSubmitting).toBeTrue();

      subject.next({ message: 'Success' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: MessageStatus.Success,
        summary: 'Password reset',
        detail: 'Password reset you can now login with your new password.',
        life: 8000
      });
      expect(component.isSubmitting).toBeFalse();
    });

    it('should send a fail message', () => {
      subject.next({ message: 'Fail' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: MessageStatus.Warning,
        summary: 'Password reset failed',
        detail: 'Fail',
        life: 8000
      });
    });

    it('should catch errors', () => {
      subject.error({ message: 'fail' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: MessageStatus.Error,
        summary: 'Password reset Error',
        detail: 'fail',
        life: 8000
      });
    });
  });
});

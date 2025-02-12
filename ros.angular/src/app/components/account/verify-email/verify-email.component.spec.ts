import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageResult } from '@models/common.model';
import { AccountService } from '@services/account.service';
import { MessageService } from '@services/message.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { Subject } from 'rxjs';
import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);
  const accountServiceSpy: Spy<AccountService> = autoSpy(AccountService);

  messageServiceSpy.add.and.returnValue();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule.withRoutes([{ path: 'account/login', component: VerifyEmailComponent }])
      ],
      declarations: [VerifyEmailComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error if token is invalid', () => {
    component.token = undefined;
    component.verifyToken();

    expect(messageServiceSpy.add).toHaveBeenCalledWith(component.addMessages.tokenUndefined);
  });

  describe('Verify Email', () => {
    let subject: Subject<MessageResult>;

    beforeEach(() => {
      subject = new Subject<MessageResult>();
      accountServiceSpy.verifyEmail.and.returnValue(subject.asObservable());
      component.token = 'test';
      component.verifyToken();
    });

    it('should display an error message if verification token did not match on the server', () => {
      subject.next({ message: 'Verification Failed' });
      expect(messageServiceSpy.add).toHaveBeenCalledWith(component.addMessages.verificationFailed);
    });

    it('should display a success message on success', () => {
      subject.next({ message: 'Success' });
      expect(messageServiceSpy.add).toHaveBeenCalledWith(component.addMessages.emailVerifiedSuccess);
    });

    it('should catch errors in the pipe', () => {
      subject.error({ message: 'fail' });
      expect(messageServiceSpy.add).toHaveBeenCalledWith(component.addMessages.catchErrorFail);
    });
  });
});

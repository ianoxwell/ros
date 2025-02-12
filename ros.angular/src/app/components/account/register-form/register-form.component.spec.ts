import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { AccountService } from '@services/account.service';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { StorageService } from '@services/storage/storage.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { MockComponent } from 'ng-mocks';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);
  const accountServiceSpy: Spy<AccountService> = autoSpy(AccountService);
  const loginServiceSpy: Spy<LoginService> = autoSpy(LoginService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        RouterTestingModule.withRoutes([{ path: 'account/login', component: RegisterFormComponent }]),
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      declarations: [RegisterFormComponent, MockComponent(SaveButtonComponent)],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { StorageService } from '@services/storage/storage.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  const loginServiceSpy: Spy<LoginService> = autoSpy(LoginService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);
  const socialAuthServiceSpy: Spy<SocialAuthService> = autoSpy(SocialAuthService);
  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);
  loginServiceSpy.isAuthenticated.and.returnValue(false);
  storageServiceSpy.observeStorageEventItem.and.returnValue(of('test'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginFormComponent, MockComponents(SaveButtonComponent)],
    imports: [ReactiveFormsModule,
        RouterTestingModule.withRoutes([
            {
                path: '',
                component: LoginFormComponent
            }
        ]),
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        MatCardModule,
        MatCheckboxModule,
        MatButtonModule,
        NoopAnimationsModule],
    providers: [
        { provide: LoginService, userValue: loginServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

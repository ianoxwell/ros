import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { DialogService } from '@services/dialog.service';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { StorageService } from '@services/storage/storage.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { SocialAuthService } from 'angularx-social-login';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);
  const dialogServiceSpy: Spy<DialogService> = autoSpy(DialogService);
  const socialAuthSpy: Spy<SocialAuthService> = autoSpy(SocialAuthService);
  const loginServiceSpy: Spy<LoginService> = autoSpy(LoginService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);

  loginServiceSpy.getTokenUsingGoogleToken.and.returnValue(of(false));
  storageServiceSpy.observeStorageEventItem.and.returnValue(of());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatDialogModule, MatSnackBarModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [LoginComponent, MockComponent(LoadingIndicatorComponent)],
      providers: [
        { provide: LoginService, userValue: loginServiceSpy },
        { provide: DialogService, userValue: dialogServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SocialAuthService, useValue: socialAuthSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Note authState returns an observable, but is declared as a get, therefore ordinary spy methods don't work.
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Object.defineProperty(socialAuthSpy, 'authState', { get: () => {} });
    spyOnProperty(socialAuthSpy, 'authState', 'get').and.returnValue(of());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

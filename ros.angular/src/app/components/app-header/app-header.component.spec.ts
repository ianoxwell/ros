import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '@services/login/login.service';
import { StorageService } from '@services/storage/storage.service';
import { autoSpy, Spy } from 'autospy';
import { of } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { AppHeaderComponent } from './app-header.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  const userProfileServiceSpy: Spy<UserProfileService> = autoSpy(UserProfileService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);
  const socialAuthSpy: Spy<SocialAuthService> = autoSpy(SocialAuthService);
  const loginServiceSpy: Spy<LoginService> = autoSpy(LoginService);

  loginServiceSpy.getTokenUsingGoogleToken.and.returnValue(of(false));
  storageServiceSpy.observeStorageEventItem.and.returnValue(of());

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    declarations: [AppHeaderComponent],
    imports: [MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatDividerModule,
        MatMenuModule,
        RouterTestingModule,
        NoopAnimationsModule],
    providers: [
        { provide: UserProfileService, userValue: userProfileServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SocialAuthService, useValue: socialAuthSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
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

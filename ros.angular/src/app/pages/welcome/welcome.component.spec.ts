import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { SiteLogoComponent } from '@components/site-logo/site-logo.component';
import { ToastComponent } from '@components/toast/toast.component';
import { LoginService } from '@services/login/login.service';
import { StorageService } from '@services/storage/storage.service';
import { SocialAuthService } from 'angularx-social-login';
import { autoSpy, Spy } from 'autospy';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  const loginServiceSpy: Spy<LoginService> = autoSpy(LoginService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);
  const socialAuthServiceSpy: Spy<SocialAuthService> = autoSpy(SocialAuthService);
  loginServiceSpy.isAuthenticated.and.returnValue(false);
  storageServiceSpy.observeItem.and.returnValue(of('test'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: WelcomeComponent
          }
        ]),
        HttpClientModule
      ],
      declarations: [WelcomeComponent, MockComponents(PageTitleComponent, ToastComponent, SiteLogoComponent)],
      providers: [
        { provide: LoginService, userValue: loginServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

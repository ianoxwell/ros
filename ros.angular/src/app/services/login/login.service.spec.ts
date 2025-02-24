import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { autoSpy, Spy } from '@tests/auto-spy';
import { of } from 'rxjs';
import { LoginService } from './login.service';
import { StorageService } from '../storage/storage.service';
import { UserProfileService } from '../user-profile.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;

  const userProfileServiceSpy: Spy<UserProfileService> = autoSpy(UserProfileService);
  const storageServiceSpy: Spy<StorageService> = autoSpy(StorageService);
  const socialAuthServiceSpy: Spy<SocialAuthService> = autoSpy(SocialAuthService);
  storageServiceSpy.observeStorageEventItem.and.returnValue(of());

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        LoginService,
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(LoginService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});

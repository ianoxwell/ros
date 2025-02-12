import { TestBed } from '@angular/core/testing';
import { IGoogleJwt } from './google-jwt.model';

import { JwtHelperService } from './jwt-helper.service';
import { IPaymentJWT } from './payment-jwt.model';

describe('JwtHelperService', () => {
  let service: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decode a jwt', () => {
    /**
     * Decoded payload - from https://jwt.io/
     * {
     *     "sub": "1234567890",
     *     "name": "John Doe",
     *     "iat": 1516239022
     *   }
     */
    const encodedJwt =
      // eslint-disable-next-line max-len
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const result = service.decodeToken<IPaymentJWT>(encodedJwt);

    expect(result.name).toEqual('John Doe');
  });

  it('should return expired', () => {
    const decodeTokenSpy: jasmine.Spy = spyOn(service, 'decodeToken').and.returnValue({
      expiry: new Date('2021-10-09').getTime()
    });

    const result = service.isTokenFresh<IGoogleJwt>('testToken', 'expiry');

    expect(decodeTokenSpy).toHaveBeenCalledWith('testToken');
    expect(result).toBeFalse();
  });
});

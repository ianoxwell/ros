import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpStatusCode } from '../models/security.models';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private apiURL = environment.apiUrl + environment.apiVersion;
  tokenKey = 'token';

  constructor(private loginService: LoginService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if the token exists and the connections file has been read and the url being accessed is the api - add the Token
    if (
      (req.url.startsWith(this.apiURL) && req.url.indexOf('account') === -1) ||
      req.url.indexOf('/api/v1/account/get-account') > -1
    ) {
      if (this.loginService.getJwt()) {
        req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${this.loginService.getJwt()}`) });
      }

      return next.handle(req).pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((event: HttpEvent<any>) => {
          // Check for a Response
          // Continue the cycle
          return event;
        }),
        catchError((error: unknown) => {
          // Check for an actual error
          if (error instanceof HttpErrorResponse) {
            // Refresh token expiry first attempt
            if (error.status === HttpStatusCode.AuthorizationRequired || error.status === HttpStatusCode.Forbidden) {
              console.log('attempting to re-authenticate', error);
              // Attempt to refresh the session
            }
          }
          console.log('Caught Http Error!');
          console.log(error);
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}

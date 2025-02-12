import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { JwtHelperService } from '@services/jwt/jwt-helper.service';
import { ILocalUserJwt } from '@services/jwt/local-user-jwt.model';
import { LoginService } from '@services/login/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private jwtHelperService: JwtHelperService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if there is a local JWT and if it has not expired
    return this.jwtHelperService.isTokenFresh<ILocalUserJwt>(this.loginService.getJwt(), 'exp');
  }
}

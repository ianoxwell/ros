import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {
  /** Decodes the token, parses and attempts to cast to T. */
  decodeToken<T>(token: string): T {
    return JSON.parse(atob(token.split('.')[1])) as T;
  }

  /** Decodes the jwt token and compares to current time to see if the token is still fresh. */
  isTokenFresh<T>(token: string, expiryKey: string): boolean {
    const expiryString = this.decodeToken<T>(token)[expiryKey as keyof T] as unknown as string;
    const expiry = new Date(expiryString).getTime() * 1000;

    return new Date().getTime() < expiry;
  }
}

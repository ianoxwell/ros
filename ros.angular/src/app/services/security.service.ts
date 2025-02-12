import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageStatus } from '@models/message.model';
import { SecurityPermission, SecurityRole } from '@models/security.models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ILocalUserJwt } from './jwt/local-user-jwt.model';
import { LogService } from './log.service';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  publicUrlPaths = ([] = ['/token/google', '/account/']);
  constructor(private http: HttpClient, private loginService: LoginService, private logService: LogService) {}
  /**
   * Logout and return the user to login.
   */
  logout(): Observable<boolean> {
    return this.logService
      .logMessage(MessageStatus.Success, null, `Authentication: ${this.getCurrentUsername()} logged out`, null)
      .pipe(tap(() => this.loginService.hardLogout()));
  }

  /**
   * Checks if current location is public.
   */
  isPublicUrl(): boolean {
    const path = this.publicUrlPaths.find((p) => {
      return location.pathname.toLowerCase().indexOf(p) === 0;
    });

    const isPublic = !path ? false : true;
    return isPublic;
  }
  private getClaims(): string[] | null {
    return this.loginService.getClaims();
  }

  /**
   * Is the current authenticated user authorised for the specified permission
   * @param permission the permission to check authorisation against.
   * @param facilityId the facility to check authorisation against.
   */
  public isAuthorised(permission: SecurityPermission, facilityId?: number): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // If the perms dictionary doesn't have the permission, no dice
    const permString = SecurityPermission[permission];
    if (!this.getClaims()?.includes(permString)) {
      return false;
    }

    return true;
  }

  /**
   * Is the current user authenticated and authorised for at least one of the specified permissions
   */
  public isAuthorisedInAnyPermissions(permissions: SecurityPermission[], facilityId?: number): boolean {
    // No need to proceed any further if there is no permissions to check against
    if (permissions.length <= 0) {
      return false;
    }

    // Check if the user is authorised in at least one permission
    return permissions.some((item: SecurityPermission) => {
      if (this.isAuthorised(item, facilityId)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Is the current authenticated user authenticated in any facility for the permission.
   */
  public isAuthorisedInAnyFacility(permission: SecurityPermission): boolean {
    return this.isAuthorised(permission);
  }
  public isAuthenticated(): boolean {
    return this.loginService.isAuthenticated();
  }

  // TODO: implement the api for this
  canEditUser(contextUserId: number): Observable<boolean> {
    const currentUserId = this.getCurrentUserId();
    const newParams = new HttpParams()
      .set('currentUserId', currentUserId.toString())
      .set('contextUserId', contextUserId.toString());
    const url = `${environment.apiUrl}${environment.apiVersion}admin/roles/canEditUser`;
    return this.http.get<boolean>(url, { params: newParams });
  }

  /** Gets the current users username */
  getCurrentUsername(): string {
    const claims: ILocalUserJwt = this.loginService.decodeLocalUserToken();
    // Check for claims - This fails on the login page
    if (!claims) {
      return '';
    }

    // Return the users name based on the current user in a common format
    return claims.email;
  }

  /** Returns an object that contains the family name and given name of the current user from the Jwt */
  getCurrentUserNameDetail(): { surname: string; givenName: string } | null {
    const claims: ILocalUserJwt = this.loginService.decodeLocalUserToken();

    // Check for claims - This fails on the login page
    if (!claims) {
      return null;
    }

    return { surname: claims.surname, givenName: claims.givenname };
  }

  /** Gets the current user id */
  getCurrentUserId(): number {
    const localJwt: ILocalUserJwt = this.loginService.decodeLocalUserToken();

    return Number(localJwt.sub) || 0;
  }

  /** Gets the current user id */
  getUserRole(role: SecurityRole): string | undefined {
    const claims = this.getClaims();
    return !!claims ? claims.find((r) => r === role.valueOf()) : '';
  }
}

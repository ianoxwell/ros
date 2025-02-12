import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResult } from '@models/common.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiURL = environment.apiUrl + environment.apiVersion;

  constructor(private httpClient: HttpClient) {}

  // *
  // User Items - split out?
  // *
  // TODO add the query filters
  public getUsers(queryString: string | null): Observable<Array<IUser>> {
    return this.httpClient.get<Array<IUser>>(this.apiURL + 'admin/users' + queryString, {
      headers: this.defaultHeader
    });
  }
  public createUser(user: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(this.apiURL + 'admin/users/save', user, { headers: this.defaultHeader });
  }

  // TODO does this need its own end point and update process?
  public updateUser(userID: string, update: any): Observable<IUser> {
    return this.httpClient.put<IUser>(this.apiURL + 'admin/users/save' + userID, update, {
      headers: this.defaultHeader
    });
  }

  // TODO implement the API
  public deleteUser(userID: string): Observable<IUser> {
    return this.httpClient.delete<IUser>(this.apiURL + 'admin/users/' + userID, { headers: this.defaultHeader });
  }

  // TODO implement the API
  public getUserByEmail(emailString: string): Observable<PagedResult<IUser>> {
    return this.httpClient.get<PagedResult<IUser>>(this.apiURL + `user?filter=email%3D${emailString}`, {
      headers: this.defaultHeader
    });
  }

  public getUserById(userID: string): Observable<IUser> {
    return this.httpClient.get<IUser>(this.apiURL + 'admin/users/' + userID, { headers: this.defaultHeader });
  }
}

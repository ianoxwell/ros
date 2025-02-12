import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewUser } from '@models/accounts.model';
import { MessageResult } from '@models/common.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AccountService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private baseUrl = `${environment.apiUrl}${environment.apiVersion}account`;
  constructor(private http: HttpClient) {}

  register(account: INewUser): Observable<MessageResult> {
    return this.http.post<MessageResult>(`${this.baseUrl}/register`, account);
  }

  verifyEmail(token: string): Observable<MessageResult> {
    return this.http.post<MessageResult>(`${this.baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string): Observable<MessageResult> {
    return this.http.post<MessageResult>(`${this.baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string): Observable<MessageResult> {
    return this.http.post<MessageResult>(`${this.baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<MessageResult> {
    return this.http.post<MessageResult>(`${this.baseUrl}/reset-password`, { token, password, confirmPassword });
  }

  checkEmailAvailable(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/email-available?email=${email}`);
  }
}

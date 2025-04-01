import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAllReferences } from '@DomainModels/reference.dto';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppStore } from '../../app.store';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiUrl = environment.apiUrl + environment.apiVersion;

  constructor(
    private httpClient: HttpClient,
    private appStore: AppStore
  ) {}

  getAllReferencesAsync(): Observable<IAllReferences | undefined> {
    this.appStore.setLoadingReferences(true);
    return this.httpClient.get<IAllReferences>(`${this.apiUrl}reference/all`, { headers: this.defaultHeader }).pipe(
      tap((ref: IAllReferences) => {
        this.appStore.setReferences(ref);
      }),
      finalize(() => this.appStore.setLoadingReferences(false)),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        console.log('Error getting reference Data', err);
        return of(undefined);
      })
    );
  }
}

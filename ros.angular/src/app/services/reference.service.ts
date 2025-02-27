import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IReferenceAll } from '@models/reference.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private _referenceAll: IReferenceAll | undefined;

  private _measurements: IMeasurement[] = [];

  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiUrl = environment.apiUrl + environment.apiVersion;

  constructor(private httpClient: HttpClient) {}

  getAllReferences(): IReferenceAll {
    if (!this._referenceAll) {
      throw 'References not yet loaded - unexpected error';
    }

    return this._referenceAll;
  }

  getMeasurements(): IMeasurement[] {
    if (!this._measurements.length) {
      throw 'Measurements not yet loaded - unexpected error';
    }

    return this._measurements;
  }

  getAllReferencesAsync(): Observable<IReferenceAll> {
    return this.httpClient.get<IReferenceAll>(`${this.apiUrl}reference`, { headers: this.defaultHeader }).pipe(
      tap((ref: IReferenceAll) => {
        this._referenceAll = ref;
      }),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        console.log('Error getting reference Data', err);
        return of({});
      })
    );
  }

  getMeasurementsAsync(): Observable<Array<IMeasurement>> {
    return this.httpClient
      .get<Array<IMeasurement>>(`${this.apiUrl}measurement`, {
        headers: this.defaultHeader
      })
      .pipe(
        tap((m: IMeasurement[]) => {
          this._measurements = m;
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          console.log('Error getting measurement Data', err);
          return of([]);
        })
      );
  }
}

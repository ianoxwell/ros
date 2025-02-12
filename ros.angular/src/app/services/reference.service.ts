import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IReferenceAll } from '@models/reference.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RefDataService } from './ref-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private refAllSubject$ = new BehaviorSubject<IReferenceAll | undefined>(undefined);

  private measurementSubject$ = new BehaviorSubject<IMeasurement[]>([]);

  constructor(private refDataService: RefDataService) {}

  getAllReferences(): Observable<IReferenceAll> {
    return this.refAllSubject$.pipe(
      switchMap((refAll: IReferenceAll | undefined) => {
        return !!refAll ? of(refAll) : this.setRefAll();
      })
    );
  }

  setRefAll(): Observable<IReferenceAll> {
    return this.refDataService.getAllReferences().pipe(
      map((result: IReferenceAll) => {
        this.refAllSubject$.next(result);
        return result;
      }),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        console.log('Error getting all reference Data', err);
        return of({});
      })
    );
  }

  getMeasurements(): Observable<Array<IMeasurement>> {
    return !!this.measurementSubject$.value ? this.measurementSubject$.asObservable() : this.setMeasurements();
  }

  setMeasurements(): Observable<Array<IMeasurement>> {
    return this.refDataService.getMeasurements().pipe(
      map((result: IMeasurement[]) => {
        this.measurementSubject$.next(result);
        return result;
      }),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        console.log('Error getting measurement Data', err);
        return of([]);
      })
    );
  }
}

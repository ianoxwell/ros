import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import {
  IReferenceAll,
  EReferenceDetail,
  IReferenceItem,
  IReferenceItemFull,
  EReferenceType
} from '@models/reference.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {
  private defaultHeader = new HttpHeaders()
    .set('Content-Type', 'application/json;odata=verbose')
    .set('Accept', 'application/json;odata=verbose');
  private apiUrl = environment.apiUrl + environment.apiVersion;

  constructor(private router: Router, private httpClient: HttpClient) {}

  public getReference(
    type: EReferenceType,
    detail = EReferenceDetail.Basic
  ): Observable<IReferenceItem | IReferenceItemFull> {
    return this.httpClient.get<IReferenceItem | IReferenceItemFull>(
      `${this.apiUrl}reference?type=${type}&detail=${detail}`,
      { headers: this.defaultHeader }
    );
  }

  public getAllReferences(): Observable<IReferenceAll> {
    return this.httpClient.get<IReferenceAll>(`${this.apiUrl}reference/all`, { headers: this.defaultHeader });
  }

  public getMeasurements(): Observable<Array<IMeasurement>> {
    return this.httpClient.get<Array<IMeasurement>>(`${this.apiUrl}reference/measurements`, {
      headers: this.defaultHeader
    });
  }
}

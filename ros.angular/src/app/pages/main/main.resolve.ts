import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { IReferenceAll } from '@models/reference.model';
import { ReferenceService } from '@services/reference.service';
import { combineLatest, firstValueFrom, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MainResolver implements Resolve<IReferenceAll> {
  constructor(private referenceService: ReferenceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IReferenceAll | RedirectCommand> {
    return firstValueFrom(
      combineLatest([this.referenceService.getAllReferencesAsync(), this.referenceService.getMeasurementsAsync()]).pipe(
        map(([ref, _]) => {
          return ref;
        })
      )
    );
  }
}

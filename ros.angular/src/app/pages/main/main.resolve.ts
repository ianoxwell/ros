import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { IAllReferences } from '@DomainModels/reference.dto';
import { ReferenceService } from '@services/references/reference.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MainResolver implements Resolve<IAllReferences | undefined> {
  constructor(private referenceService: ReferenceService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IAllReferences | undefined | RedirectCommand> {
    return firstValueFrom(
      this.referenceService.getAllReferencesAsync().pipe(
        map((ref) => {
          return ref;
        })
      )
    );
  }
}

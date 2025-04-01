import { computed, Injectable, signal } from '@angular/core';
import { IUserSummary } from '@DomainModels/user.dto';
import { IAllReferences } from '@DomainModels/reference.dto';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly state = {
    $user: signal<IUserSummary | null>(null),
    $references: signal<IAllReferences | undefined>(undefined),
    $loadingUser: signal<boolean>(false),
    $loadingReferences: signal<boolean>(false)
  } as const;

  public readonly $user = this.state.$user.asReadonly();
  public readonly $references = this.state.$references.asReadonly();
  public readonly $loadingUser = this.state.$loadingUser.asReadonly();
  public readonly $loadingReferences = this.state.$loadingReferences.asReadonly();
  public readonly $loading = computed<boolean>(() => this.$loadingUser() || this.$loadingReferences());
  
  setUser(user: IUserSummary | null): void {
    this.state.$user.set(user);
  }

  setReferences(references: IAllReferences | undefined): void {
    this.state.$references.set(references);
  }

  setLoadingUser(isLoading: boolean): void {
    this.state.$loadingUser.set(isLoading);
  }

  setLoadingReferences(isLoading: boolean): void {
    this.state.$loadingReferences.set(isLoading);
  }
}

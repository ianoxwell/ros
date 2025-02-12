import { Injectable } from '@angular/core';
import { AdminRights, IdTitlePair } from '@models/common.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser, IUserRole } from '../models/user';
import { CStorageKeys } from './storage/storage-keys.const';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userProfile$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  readonly storageKeys = CStorageKeys;
  constructor(private storageService: StorageService) {}

  /** Gets the user profile either from the behaviour subject or local storage. */
  getUserProfile(): Observable<IUser | null> {
    return this.userProfile$.asObservable().pipe(
      map((user: IUser | null) => {
        if (!user) {
          user = this.storageService.getItem<IUser>(this.storageKeys.userProfile) as IUser | null;
        }

        return user;
      })
    );
  }

  /** Sets the user profile behaviourSubject along with local storage or removes the stored object. */
  setUserProfile(userProfile: IUser | null) {
    this.userProfile$.next(userProfile);
    if (!!userProfile) {
      this.storageService.setItem(this.storageKeys.userProfile, JSON.stringify(userProfile));
    } else {
      this.storageService.removeItem(this.storageKeys.userProfile);
    }
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  setLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn$.next(isLoggedIn);
  }

  checkAdminRights(user: IUser): AdminRights {
    const schoolAdmin: IdTitlePair[] = [];
    let globalAdmin = false;
    user.userRole?.forEach((roleItem: IUserRole) => {
      if (roleItem.role.isAdmin && roleItem.isCountryWide) {
        globalAdmin = true;
      } else if (roleItem.role.isAdmin && !!roleItem.schoolId && !!roleItem.school) {
        schoolAdmin.push({ id: roleItem.schoolId, title: roleItem.school.title });
      }
    });
    return {
      globalAdmin,
      schoolAdmin
    };
  }
}

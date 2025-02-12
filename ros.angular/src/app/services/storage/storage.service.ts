import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class StorageService {
  /**
   * Retrieves a specific item from the browser's local storage.
   * @param key The item to be retrieved.
   * @returns The specified item in local storage if it exists, otherwise null.
   */
  getItem<T>(key: string, isLocal = true): string | null | T {
    let item: string | null | T = this.getStorage(isLocal).getItem(key);
    if (item === 'undefined' || item === 'null') {
      item = null;
    } else {
      item = this.tryParseJSONObject<T>(item as string);
    }
    return item;
  }

  /**
   * Tries to parse the Json string and cast to an expected object.
   * @param jsonString string to try converting to Json/
   * @returns either an expected object (T), or original string.
   */
  tryParseJSONObject<T>(jsonString: string): string | T {
    try {
      const parsedString = JSON.parse(jsonString);
      if (!!parsedString && typeof parsedString === 'object') {
        return parsedString as T;
      }
    } catch (e) {}

    return jsonString;
  }

  /**
   * Updates or creates the given item in local storage.
   * @param key The key of the item to create or update.
   * @param value The value of the item to create or update as string.
   */
  setItem(key: string, value: string, isLocal = true): void {
    this.getStorage(isLocal).setItem(key, value);
  }

  /**
   * Removes the given item from local storage.
   * @param key The key of the item to be removed.
   */
  removeItem(key: string, isLocal = true): void {
    this.getStorage(isLocal).removeItem(key);
  }

  /**
   * Clears all the local storage items. Useful for logout events.
   */
  clearStorage(isLocal = true): void {
    this.getStorage(isLocal).clear();
  }

  /**
   * Observes a given item in local storage and updates observer
   * when the item is updated in another browser tab.
   * @param key The key of the item to be observed.
   * @returns An observable that emits the given item's new value
   * whenever it is updated.
   */
  observeStorageEventItem(key: string, isLocal = true): Observable<string> {
    const storageObservable$ = this.windowStorageEvent().pipe(
      filter((event: StorageEvent) => event.storageArea === this.getStorage(isLocal)),
      filter((event: StorageEvent) => event.key === key),
      map((event: StorageEvent) => event.newValue as string)
    );

    return storageObservable$;
  }

  private windowStorageEvent(): Observable<StorageEvent> {
    return fromEvent<StorageEvent>(window, 'storage');
  }

  /**
   * Fetches the browser's full local storage.
   * @returns A storage object containing methods to access and update the
   * browser's local storage.
   */
  private getStorage(isLocal: boolean): Storage {
    return isLocal ? window.localStorage : window.sessionStorage;
  }
}

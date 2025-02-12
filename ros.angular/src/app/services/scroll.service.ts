import { ViewportScroller } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { IScrollPositions } from '@models/common.model';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService implements OnDestroy {
  private unSubscribe$ = new Subject<void>();
  private scrollPosition$ = new BehaviorSubject<IScrollPositions>({ prev: 0, current: 0 });

  constructor(private vc: ViewportScroller) {
    fromEvent(window, 'scroll')
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => {
          const newPrev = this.scrollPosition$.value.current;
          this.scrollPosition$.next({ prev: newPrev, current: this.vc.getScrollPosition()[1] });
        }),
        takeUntil(this.unSubscribe$)
      )
      .subscribe();
  }

  getScrollPosition(): Observable<IScrollPositions> {
    return this.scrollPosition$.asObservable();
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}

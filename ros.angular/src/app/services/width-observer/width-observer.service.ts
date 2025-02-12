import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WidthObserverService {
  isMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentScreenSize$: BehaviorSubject<string> = new BehaviorSubject<string>('XSmall');

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge']
  ]);
  constructor(private breakpointObserver: BreakpointObserver) {}

  listenBreakpoints(): Observable<string> {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        switchMap((result: BreakpointState) => {
          let currentScreenSize = 'XSmall';
          Object.keys(result.breakpoints).some((query: string) => {
            if (result.breakpoints[query]) {
              currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
              this.currentScreenSize$.next(currentScreenSize);
            }
          });
          this.isMobile$.next(currentScreenSize === 'XSmall' || currentScreenSize === 'Small');
          return currentScreenSize;
        })
      );
  }

  getIsMobile(): Observable<boolean> {
    return this.isMobile$.asObservable();
  }

  getCurrentScreenSize(): Observable<string> {
    return this.currentScreenSize$.asObservable();
  }
}

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { autoSpy, Spy } from '@tests/auto-spy';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { WidthObserverService } from './width-observer.service';

describe('WidthObserverService', () => {
  let service: WidthObserverService;

  const breakpointObserverSpy: Spy<BreakpointObserver> = autoSpy(BreakpointObserver);

  const breakPointLarge: BreakpointState = {
    breakpoints: {
      '(max-width: 599.98px)': false,
      '(min-width: 600px) and (max-width: 959.98px)': false,
      '(min-width: 960px) and (max-width: 1279.98px)': false,
      '(min-width: 1280px) and (max-width: 1919.98px)': false,
      '(min-width: 1920px)': true
    },
    matches: true
  };

  const breakPointSmall: BreakpointState = {
    breakpoints: {
      '(max-width: 599.98px)': true,
      '(min-width: 600px) and (max-width: 959.98px)': false,
      '(min-width: 960px) and (max-width: 1279.98px)': false,
      '(min-width: 1280px) and (max-width: 1919.98px)': false,
      '(min-width: 1920px)': false
    },
    matches: true
  };

  const breakPointUnknown: BreakpointState = {
    breakpoints: {
      '(max-width: 599.98px)': false,
      '(min-width: 600px) and (max-width: 959.98px)': false,
      '(min-width: 960px) and (max-width: 1279.98px)': false,
      '(min-width: 1280px) and (max-width: 1919.98px)': false,
      '(min-width: potatoe)': true
    },
    matches: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useValue: breakpointObserverSpy }]
    });
    service = TestBed.inject(WidthObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listen Break points', () => {
    let subject: Subject<BreakpointState>;

    beforeEach(() => {
      subject = new Subject<BreakpointState>();
      breakpointObserverSpy.observe.and.returnValue(subject.asObservable());
    });

    it('should return as XLarge for width above 1920px', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointLarge);
      service
        .getCurrentScreenSize()
        .pipe(take(1))
        .subscribe((result: string) => {
          expect(result).toBe('XLarge');
        });
    });

    it('should return false for mobile for width below 600px', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointLarge);
      service
        .getIsMobile()
        .pipe(take(1))
        .subscribe((result: boolean) => {
          expect(result).toBeFalse();
        });
    });

    it('should return as XSmall for width below 600px', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointSmall);
      service
        .getCurrentScreenSize()
        .pipe(take(1))
        .subscribe((result: string) => {
          expect(result).toBe('XSmall');
        });
    });

    it('should return true for mobile for width above 1920px', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointSmall);
      service
        .getIsMobile()
        .pipe(take(1))
        .subscribe((result: boolean) => {
          expect(result).toBeTrue();
        });
    });

    it('should return unknown for no match', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointUnknown);
      service
        .getCurrentScreenSize()
        .pipe(take(1))
        .subscribe((result: string) => {
          expect(result).toBe('Unknown');
        });
    });

    it('should return false for mobile for no match', () => {
      service.listenBreakpoints().pipe(take(1)).subscribe();
      subject.next(breakPointUnknown);
      service
        .getIsMobile()
        .pipe(take(1))
        .subscribe((result: boolean) => {
          expect(result).toBeFalse();
        });
    });
  });
});

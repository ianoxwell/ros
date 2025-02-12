import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { Subject } from 'rxjs';
import { IngredientsComponent } from 'src/app/pages/ingredients/ingredients.component';
import { RecipesComponent } from 'src/app/pages/recipe/recipes.component';
import { NavigationService } from './navigation.service';
import { CRouteList } from './route-list.const';

describe('NavigationService', () => {
  let service: NavigationService;
  let location: Location;
  let router: Router;
  let routerEvents: Subject<RouterEvent>;

  const routeList = CRouteList;

  const routes = [
    { path: routeList.ingredients, component: MockComponent(IngredientsComponent) },
    { path: routeList.recipes, component: MockComponent(RecipesComponent) }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)]
    });
    router = TestBed.inject(Router);
    routerEvents = router.events as unknown as Subject<RouterEvent>;
    location = TestBed.inject(Location);
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listening to route end', () => {
    it('should output the new route url', () => {
      const expectedUrl = '/test';
      service.listenToRouteEnd().subscribe((result: string) => {
        expect(result).toEqual(expectedUrl);
      });

      const event = new NavigationEnd(42, expectedUrl, expectedUrl);
      routerEvents.next(event);
    });

    it('should set the pageUrl to the current route Config value if it exists', () => {
      const newUrl = '/new-test';
      service.pageUrlSubject$.next('');

      service.listenToRouteEnd().subscribe();

      const event = new NavigationEnd(42, newUrl, newUrl);
      routerEvents.next(event);

      service.getPageUrl().subscribe((result: string) => {
        expect(result).toEqual(newUrl);
      });
    });
  });

  describe('Navigation back', () => {
    it('should navigate back a page and remove last two items from urlHistory', fakeAsync(() => {
      service.urlHistory = [`/test`, routeList.ingredients, routeList.recipes];

      service.navigateBack();

      tick();
      expect(location.path()).toEqual(routeList.ingredients);
      expect(service.urlHistory.length).toEqual(1);
    }));

    it('should navigate to an alternative url', () => {
      const productsUrl = '/products';
      const navigateToSpy = spyOn(service, 'navigateToUrl');
      service.urlHistory = ['test1', 'test2'];

      service.navigateBack(productsUrl);

      expect(navigateToSpy).toHaveBeenCalledWith(productsUrl);
    });
  });

  it('should navigate to URL', fakeAsync(() => {
    const url = '/accounts';
    const expectedUrl = `/${routeList.login}`;

    service.navigateToUrl(url);

    tick();
    expect(location.path()).toEqual(expectedUrl);
  }));

  it('should open a new external page', () => {
    const windowOpenSpy: jasmine.Spy = spyOn(window, 'open');

    service.navigateToExternalPage('mailto:?subject=test');

    expect(windowOpenSpy).toHaveBeenCalledWith('mailto:?subject=test', '_blank');
  });
});

/**
 * @notes
 * This spec file has been generated by oughtaTest
 * Based heavily upon the scuri work of Georgi Parlakov - https://github.com/gparlakov/scuri
 * Assuming that the app contains autoSpy and correct path declaration in tsconfig e.g. "autospy": ["src/app/tests/auto-spy"]
 * Also assuming package contains angularMaterial>8 and ng-mocks as a devDependencies - https://github.com/ike18t/ng-mocks#readme
 */
import { Location } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { IUserSummary } from '@DomainModels/user.dto';
import { ToTitleCasePipe } from '@pipes/title-case.pipe';
import { MessageService } from '@services/message.service';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { RestRecipeService } from '@services/rest-recipe.service';
import { UserProfileService } from '@services/user-profile.service';
import { autoSpy, Spy } from 'autospy';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { RecipeViewComponent } from 'src/app/pages/recipe/recipe-view/recipe-view.component';
import { SearchBarComponent } from 'src/app/pages/recipe/search-bar/search-bar.component';
import { RecipesComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  const restRecipeServiceSpy: Spy<RestRecipeService> = autoSpy(RestRecipeService);
  const activatedRouteSpy: Spy<ActivatedRoute> = autoSpy(ActivatedRoute);
  activatedRouteSpy.snapshot = { routeConfig: { url: '', path: '' } } as unknown as ActivatedRouteSnapshot;
  activatedRouteSpy.params = of({});
  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return '123';
        }
      },
      routeConfig: { url: '', path: '' }
    }
  } as unknown as ActivatedRoute;

  const restIngredientServiceSpy: Spy<RestIngredientService> = autoSpy(RestIngredientService);
  const locationSpy: Spy<Location> = autoSpy(Location);
  const userProfileServiceSpy: Spy<UserProfileService> = autoSpy(UserProfileService);
  userProfileServiceSpy.getUserProfile.and.returnValue(of({} as IUserSummary));
  const toTitleCasePipeSpy: Spy<ToTitleCasePipe> = autoSpy(ToTitleCasePipe);
  const messageServiceSpy: Spy<MessageService> = autoSpy(MessageService);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconModule, MatToolbarModule, MatTabsModule, MatButtonModule, NoopAnimationsModule],
        declarations: [RecipesComponent, MockComponent(RecipeViewComponent), MockComponent(SearchBarComponent)],
        providers: [
          { provide: RestRecipeService, useValue: restRecipeServiceSpy },
          { provide: ActivatedRoute, useValue: fakeActivatedRoute },
          { provide: RestIngredientService, useValue: restIngredientServiceSpy },
          { provide: Location, useValue: locationSpy },
          { provide: UserProfileService, useValue: userProfileServiceSpy },
          { provide: ToTitleCasePipe, useValue: toTitleCasePipeSpy },
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

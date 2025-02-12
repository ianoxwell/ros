import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { PagedResult } from '@models/common.model';
import { IRecipeFilterQuery, RecipeFilterQuery } from '@models/filter-queries.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { Recipe } from '@models/recipe.model';
import { IReferenceAll } from '@models/reference.model';
import { IUser } from '@models/user';
import { ConstructRecipeService } from '@services/construct-recipe.service';
import { DialogService } from '@services/dialog.service';
import { RefDataService } from '@services/ref-data.service';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { RestRecipeService } from '@services/rest-recipe.service';
import { StateService } from '@services/state.service';
import { UserProfileService } from '@services/user-profile.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent extends ComponentBase implements OnInit {
  recipes: Recipe[] = [];
  refDataAll: IReferenceAll | undefined;
  measurementRef: IMeasurement[] = [];
  isLoading = false;
  selectedRecipe: Recipe | undefined;
  selectedIndex = 0;
  selectedTab = 0; // controls the selectedIndex of the mat-tab-group
  isNew = true; // edit or new ingredient;

  currentPath: string | undefined = '';
  filterQuery: IRecipeFilterQuery = new RecipeFilterQuery();
  dataLength = 0;
  cookBookUserProfile: IUser | null = null;

  constructor(
    private restRecipeService: RestRecipeService,
    private route: ActivatedRoute,
    private restIngredientService: RestIngredientService,
    private location: Location,
    private userProfileService: UserProfileService,
    private dialogService: DialogService,
    private stateService: StateService,
    private refDataService: RefDataService,
    private constructRecipeService: ConstructRecipeService
  ) {
    super();
    this.getAllReferences();
  }

  ngOnInit(): void {
    this.userProfileService.getUserProfile().subscribe((profile) => (this.cookBookUserProfile = profile));
    this.routeParamSubscribe();
    this.listenFilterQueryChanges();
  }

  listenFilterQueryChanges(): void {
    this.stateService
      .getRecipeFilterQuery()
      .pipe(
        switchMap((result: IRecipeFilterQuery) => {
          console.log('filter result', result);
          this.filterQuery = result;
          return this.getRecipes();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
  // paused at the moment till the filtering is sorted
  routeParamSubscribe(): void {
    this.route.params
      .pipe(
        tap((params) => {
          this.currentPath = this.route.snapshot.routeConfig?.path;
          console.log('route param', params, this.currentPath);
          if (params.recipeId) {
            this.loadRecipeSelect(Number(params.recipeId));
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  /** listens to refDataService to populate the referenceData, called from init, disposed off after first response */
  getAllReferences(): void {
    combineLatest([this.refDataService.getAllReferences(), this.refDataService.getMeasurements()])
      .pipe(
        first(),
        tap(([refAll, measure]: [IReferenceAll, IMeasurement[]]) => {
          this.refDataAll = refAll;
          this.measurementRef = measure;
        })
      )
      .subscribe();
  }

  loadRecipeSelect(itemId: number | undefined): void {
    if (!itemId) {
      return;
    }

    this.restRecipeService
      .getRecipeById(itemId)
      .pipe(
        tap((singleRecipe) => {
          this.selectedRecipe = singleRecipe;
          this.changeTab(1);
          return this.getRecipes();
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          console.log('Error', err);
          return [];
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  changeRecipe(event: { direction: string; id: number | undefined }): void {
    if (!event.id) {
      return;
    }

    if (this.selectedIndex === 0 && event.direction === 'prev') {
      this.selectedIndex = this.recipes.length - 1;
    } else if (this.selectedIndex === this.recipes.length - 1 && event.direction === 'next') {
      this.selectedIndex = 0;
    } else if (event.direction === 'prev') {
      this.selectedIndex--;
    } else {
      this.selectedIndex++;
    }
    this.selectedRecipe = this.recipes[this.selectedIndex];
    this.location.replaceState(`savoury/recipes/item/${this.selectedRecipe.id}`);
  }

  onFilterChange(ev: RecipeFilterQuery) {
    console.log('here is the filter change', ev);
  }

  getRecipes(): Observable<PagedResult<Recipe>> {
    this.isLoading = true;
    this.dataLength = 0;
    return this.restRecipeService.getRecipe(this.filterQuery).pipe(
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        this.dialogService.alert('Error getting recipes', err);
        return of({ items: [], totalCount: 0 });
      }),
      tap(() => {
        console.log('stop loading');
        this.isLoading = false;
      }),
      filter((result: PagedResult<Recipe>) => result.totalCount > 0),
      tap((recipeResults: PagedResult<Recipe>) => {
        this.dataLength = recipeResults.totalCount;
        this.recipes = recipeResults.items;
        console.log('setting the recipe results', recipeResults, this.dataLength);
      })
    );
  }

  createOrEdit(action: string) {
    console.log('new maybe', action);
  }

  selectThisRecipe(recipe: Recipe, i: number) {
    // set the selectedRecipe and the selectedIndex
    this.loadRecipeSelect(recipe.id);
    this.selectedIndex = i;
    // change the tab to the recipe
    // this.changeTab(1);
  }

  changeTab(event: any) {
    this.selectedTab = event;
    if (this.selectedTab === 0) {
      this.selectedRecipe = undefined;
      this.location.replaceState('savoury/recipes/browse');
    } else if (!!this.selectedRecipe) {
      this.location.replaceState(`savoury/recipes/item/${this.selectedRecipe.id}`);
    }
  }

  getSpoonAcularRecipe(count: number): void {
    this.isLoading = true;
    if (!this.cookBookUserProfile || !this.refDataAll) {
      return;
    }

    this.constructRecipeService
      .getSpoonAcularRecipe(count, this.cookBookUserProfile.id, this.refDataAll, this.measurementRef)
      .pipe(
        first(),
        switchMap(() => this.getRecipes()),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          this.dialogService.alert('Error getting spoon recipe', err.message);
          this.isLoading = false;
          return of();
        })
      )
      .subscribe();
  }
}

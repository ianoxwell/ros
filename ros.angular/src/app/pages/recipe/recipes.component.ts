import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IRecipe, IRecipeShort } from '@DomainModels/recipe.dto';
import { IUserSummary } from '@DomainModels/user.dto';
import { CBlankPagedMeta, PagedResult } from '@models/common.model';
import { RecipeFilterQuery } from '@models/filter-queries.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IReferenceAll } from '@models/reference.model';
import { DialogService } from '@services/dialog.service';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { ReferenceService } from '@services/reference.service';
import { StateService } from '@services/state.service';
import { UserProfileService } from '@services/user-profile.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RecipeService } from 'src/app/pages/recipe/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: false
})
export class RecipesComponent extends ComponentBase implements OnInit {
  recipes: IRecipeShort[] = [];
  refDataAll: IReferenceAll | undefined;
  measurementRef: IMeasurement[] = [];
  isLoading = false;
  /** Full recipe loaded from the API */
  selectedRecipe: IRecipe | undefined;
  /** if this has value it will be the index of the selected recipe */
  selectedIndex = 0;
  selectedRecipeId: number | undefined;

  isNew = true; // edit or new ingredient;

  currentPath: string | undefined = '';
  filterQuery: IFilter = CBlankFilter;
  dataLength = 0;
  cookBookUserProfile: IUserSummary | null = null;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private dialogService: DialogService,
    private stateService: StateService,
    private referenceService: ReferenceService,
    private navigationService: NavigationService
  ) {
    super();
    this.refDataAll = this.referenceService.getAllReferences();
    this.measurementRef = this.referenceService.getMeasurements();
  }

  ngOnInit(): void {
    this.userProfileService
      .getUserProfile()
      .pipe(
        tap((profile) => (this.cookBookUserProfile = profile)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
    this.routeParamSubscribe().subscribe();
    this.listenFilterQueryChanges().subscribe();
  }

  listenFilterQueryChanges(): Observable<PagedResult<IRecipeShort>> {
    return this.stateService.getRecipeFilterQuery().pipe(
      switchMap((result: IFilter) => {
        console.log('filter result', result);
        this.filterQuery = result;
        return this.getRecipes();
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  routeParamSubscribe(): Observable<null | IRecipe> {
    return this.route.params.pipe(
      filter((params) => {
        if (!params.recipeId) {
          this.selectedRecipeId = undefined;
          this.selectedRecipe = undefined;
        }

        return params.recipeId;
      }),
      switchMap((params) => {
        this.currentPath = this.route.snapshot.routeConfig?.path;
        if (!this.selectedRecipeId) {
          this.selectedRecipeId = Number(params.recipeId);
        }

        return this.loadRecipeSelect(this.selectedRecipeId);
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  loadRecipeSelect(itemId: number | undefined): Observable<null | IRecipe> {
    if (!itemId) {
      return of(null);
    }

    return this.recipeService.getRecipeById(itemId).pipe(
      tap((singleRecipe: IRecipe) => {
        this.selectedRecipe = singleRecipe;
      }),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        console.log('Error', err);
        return [];
      }),
      takeUntil(this.ngUnsubscribe)
    );
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

    this.selectThisRecipe(this.recipes[this.selectedIndex]);
    // todo navigate to new url
  }

  onFilterChange(ev: RecipeFilterQuery) {
    console.log('here is the filter change', ev);
  }

  getRecipes(): Observable<PagedResult<IRecipeShort>> {
    this.isLoading = true;
    this.dataLength = 0;
    return this.recipeService.getRecipe(this.filterQuery).pipe(
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        this.dialogService.alert('Error getting recipes', err);
        this.isLoading = false;
        return of({
          results: [],
          meta: CBlankPagedMeta
        });
      }),
      tap(() => {
        console.log('stop loading');
        this.isLoading = false;
      }),
      filter((result: PagedResult<IRecipeShort>) => result.meta.itemCount > 0),
      tap((recipeResults: PagedResult<IRecipeShort>) => {
        this.dataLength = recipeResults.meta.itemCount;
        this.recipes = recipeResults.results;
        console.log('setting the recipe results', recipeResults, this.dataLength);
      })
    );
  }

  createOrEdit(action: string) {
    console.log('new maybe', action);
  }

  selectThisRecipe(recipe: IRecipeShort) {
    this.selectedRecipeId = recipe.id;
    this.navigationService.navigateToUrl(`savoury/recipes/item/${this.selectedRecipeId}`);
  }

  backToRecipeView() {
    this.navigationService.navigateToUrl(`${CRouteList.recipes}`);
  }
}

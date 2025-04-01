import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '@components/base/base.component.base';
import { IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IRecipe, IRecipeShort } from '@DomainModels/recipe.dto';
import { IAllReferences } from '@DomainModels/reference.dto';
import { IUserSummary } from '@DomainModels/user.dto';
import { CBlankPagedMeta } from '@models/common.model';
import { RecipeFilterQuery } from '@models/filter-queries.model';
import { DialogService } from '@services/dialog.service';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { StateService } from '@services/state.service';
import { UserProfileService } from '@services/user-profile.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AppStore } from 'src/app/app.store';
import { RecipeService } from 'src/app/pages/recipe/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: false
})
export class RecipesComponent extends ComponentBase implements OnInit {
  readonly panelOpenState = signal(false);
  recipes: IRecipeShort[] = [];
  refDataAll: IAllReferences | undefined;
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
    private navigationService: NavigationService,
    private appStore: AppStore
  ) {
    super();
    this.refDataAll = this.appStore.$references();
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

  listenFilterQueryChanges(): Observable<IPagedResult<IRecipeShort>> {
    return this.stateService.getRecipeFilterQuery().pipe(
      switchMap((result: IFilter) => {
        console.log('filter result', result);
        this.filterQuery = result;
        return this.getRecipes();
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  // triggers from the MatPaginator - emits the filterQuery object
  pageChange(ev: PageEvent): void {
    if (!this.filterQuery) {
      return;
    }

    console.log('page event', ev);
    if (ev.previousPageIndex !== ev.pageIndex) {
      this.filterQuery.page = ev.pageIndex;
    } else {
      this.filterQuery.page = 0;
      this.filterQuery.take = ev.pageSize;
    }
    this.stateService.setRecipeFilterQuery(this.filterQuery);
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

    const findIndex = this.recipes.findIndex((r) => r.id === event.id);

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
  }

  onFilterChange(ev: RecipeFilterQuery) {
    console.log('here is the filter change', ev);
  }

  getRecipes(): Observable<IPagedResult<IRecipeShort>> {
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
      filter((result: IPagedResult<IRecipeShort>) => result.meta.itemCount > 0),
      tap((recipeResults: IPagedResult<IRecipeShort>) => {
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
    this.selectedRecipe = recipe as IRecipe;
    this.navigationService.navigateToUrl(`savoury/recipes/item/${this.selectedRecipeId}`);
  }

  backToRecipeView() {
    this.navigationService.navigateToUrl(`${CRouteList.recipes}`);
  }
}

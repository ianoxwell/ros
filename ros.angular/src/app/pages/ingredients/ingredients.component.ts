import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CBlankPagedMeta, SortPageObj } from '@models/common.model';
import { MessageStatus } from '@models/message.model';
import { DialogService } from '@services/dialog.service';
import { ReferenceService } from '@services/references/reference.service';
import { IPagedResult } from '@DomainModels/base.dto';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IIngredient } from '@DomainModels/ingredient.dto';
import { IAllReferences } from '@DomainModels/reference.dto';
import { IUserSummary } from '@DomainModels/user.dto';
import { StateService } from '@services/state.service';
import { UserProfileService } from '@services/user-profile.service';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AppStore } from 'src/app/app.store';
import { IngredientService } from 'src/app/pages/ingredients/ingredient.service';
import { RecipeService } from 'src/app/pages/recipe/recipe.service';
import { ComponentBase } from '../../components/base/base.component.base';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  standalone: false
})
export class IngredientsComponent extends ComponentBase implements OnInit {
  selectedIngredient$: Observable<IIngredient> | undefined;
  selectedTab = 0; // controls the selectedIndex of the mat-tab-group
  isNew = true; // edit or new ingredient;
  cookBookUserProfile$: Observable<IUserSummary | null>;
  currentPath: string | undefined = '';
  filterObject: IFilter = CBlankFilter;
  /** !Temp - is this nEEDED? */
  sortPageObj: SortPageObj = new SortPageObj();
  data$: Observable<IPagedResult<IIngredient>>;
  isLoading = false;
  refData: IAllReferences | undefined;

  constructor(
    private ingredientService: IngredientService,
    private restRecipeService: RecipeService,
    private dialogService: DialogService,
    private userProfileService: UserProfileService,
    private location: Location,
    private route: ActivatedRoute,
    private referenceService: ReferenceService,
    private stateService: StateService,
    private appStore: AppStore
  ) {
    super();
    this.data$ = this.listenFilterQueryChanges();
    this.cookBookUserProfile$ = this.userProfileService.getUserProfile();
    this.refData = this.appStore.$references();
  }

  ngOnInit() {}

  routeParamSubscribe(): Observable<number> {
    return this.route.params.pipe(
      first(),
      map((params) => {
        this.currentPath = this.route.snapshot.routeConfig?.path;
        if (params.ingredientId) {
          this.selectedIngredient$ = this.getSingleIngredient(params.ingredientId);
        }
        return params.ingredientId || 0;
      })
    );
  }

  /**
   * Listens to the stateService ingredient filter and updates the data in the table on change.
   */
  listenFilterQueryChanges(): Observable<IPagedResult<IIngredient>> {
    return this.stateService.getIngredientFilterQuery().pipe(
      switchMap((ingredientFilterObj: IFilter) => {
        console.log('heard a change in the filter obj', ingredientFilterObj);
        this.filterObject = ingredientFilterObj;
        // this.sortPageObj = this.sortPageObj.update(this.filterObject);
        return this.getIngredientList();
      })
    );
  }

  getSingleIngredient(itemId: number): Observable<IIngredient> {
    this.isNew = false;
    return this.ingredientService.getIngredientById(itemId).pipe(
      tap((ing: IIngredient) => {
        this.selectedTab = 1;
      }),
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        this.dialogService.confirm(MessageStatus.Critical, 'Error getting ingredient', err.message);
        return of({} as IIngredient);
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  /**
   * load the ingredients that have been filtered
   * @returns Observable of Paged Result with Ingredient
   */
  getIngredientList(): Observable<IPagedResult<IIngredient>> {
    return this.ingredientService.getIngredientList(this.filterObject).pipe(
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        this.dialogService.confirm(MessageStatus.Critical, 'Error getting ingredients', err.message);
        return of({ results: [], meta: CBlankPagedMeta });
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  sortPageChange(pageEvent: IFilter) {
    console.log('there was a sortPage Change heard in ingredients', pageEvent);
    this.stateService.setIngredientFilterQuery(pageEvent);
    // this.stateService.setIngredientFilterQuery({ ...this.filterObject, ...pageEvent });
    // this.sortPageObj = this.sortPageObj.update(this.filterObject);
  }
  changeTab(event: any) {
    console.log('get rid of tabs thanks');
    // this.selectedTab = event;
    // this.filterObject.tabNumber = event;
    // if (this.selectedTab === 0) {
    //   this.selectedIngredient$ = undefined;
    //   this.location.replaceState('/savoury/ingredients');
    // }
    // this.stateService.setIngredientFilterQuery(this.filterObject);
  }
  createOrEdit(editOrNew: string, row?: IIngredient) {
    console.log('CreateOrEdit - not going to implement', editOrNew, row);
  }

  getRecipeList() {
    // load all the recipe ingredients only select ingredientLists
    this.restRecipeService.getRecipe(null).subscribe((recipes) => {
      console.log('recipes returned ', recipes, recipes);
      // this.getIngredients(recipes);
    });
  }
  //   cleanRecipeIngredients() {
  // 	this.restRecipeService.getRecipe(null)
  // 	.subscribe(recipes => {
  // 		console.log('recipes returned ', recipes);
  // 		const pArray = recipes.items.map(recipe => {
  // 		console.log('recipe name ', recipe.name);
  // 		this.cleanIngredients(recipe);
  // 		});
  // 	});
  //   }

  //   showList(ev: number) {
  // 	  this.showItem = ev;
  // 	  this.selectedRecipe = null;
  //   }
}

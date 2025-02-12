import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISortPageObj, PagedResult, SortPageObj } from '@models/common.model';
import { IIngredientFilterObject, IngredientFilterObject } from '@models/filter-queries.model';
import { IMeasurement } from '@models/ingredient/ingredient-model';
import { IIngredient } from '@models/ingredient/ingredient.model';
import { MessageStatus } from '@models/message.model';
import { IReferenceAll } from '@models/reference.model';
import { IUser } from '@models/user';
import { DialogService } from '@services/dialog.service';
import { ReferenceService } from '@services/reference.service';
// import {ConversionModel, EditedFieldModel, IngredientModel, PriceModel} from '../models/ingredient-model';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { RestRecipeService } from '@services/rest-recipe.service';
import { StateService } from '@services/state.service';
import { UserProfileService } from '@services/user-profile.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ComponentBase } from '../../components/base/base.component.base';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent extends ComponentBase implements OnInit {
  selectedIngredient$: Observable<IIngredient> | undefined;
  selectedTab = 0; // controls the selectedIndex of the mat-tab-group
  isNew = true; // edit or new ingredient;
  cookBookUserProfile$: Observable<IUser | null>;
  currentPath: string | undefined = '';
  filterObject: IIngredientFilterObject = new IngredientFilterObject();
  sortPageObj: SortPageObj = new SortPageObj();
  data$: Observable<PagedResult<IIngredient>>;
  isLoading = false;
  refData: IReferenceAll | undefined;
  measurements: IMeasurement[] = [];

  constructor(
    private restIngredientService: RestIngredientService,
    private restRecipeService: RestRecipeService,
    private dialogService: DialogService,
    private userProfileService: UserProfileService,
    private location: Location,
    private route: ActivatedRoute,
    private referenceService: ReferenceService,
    private stateService: StateService
  ) {
    super();
    this.data$ = this.listenStateService();
    this.cookBookUserProfile$ = this.userProfileService.getUserProfile();
  }

  ngOnInit() {
    this.getAllReferences();
  }

  getAllReferences(): void {
    combineLatest([this.referenceService.getAllReferences(), this.referenceService.getMeasurements()])
      .pipe(
        first(),
        switchMap(([refData, measurements]: [IReferenceAll, IMeasurement[]]) => {
          this.refData = refData;
          this.measurements = measurements;
          return this.routeParamSubscribe();
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          return this.dialogService.alert('Http error while attempting to getting references', err);
        })
      )
      .subscribe();
  }

  routeParamSubscribe(): Observable<number> {
    return this.route.params.pipe(
      first(),
      map((params) => {
        this.currentPath = this.route.snapshot.routeConfig?.path;
        if (params.ingredientId) {
          this.selectedIngredient$ = this.getSingleIngredient(params.ingredientId);
        }
        this.listenStateService();
        return params.ingredientId || 0;
      })
    );
  }

  /**
   * Listens to the stateService ingredient filter and updates the data in the table on change.
   */
  listenStateService(): Observable<PagedResult<IIngredient>> {
    return this.stateService.getIngredientFilterQuery().pipe(
      switchMap((ingredientFilterObj: IIngredientFilterObject) => {
        this.filterObject = ingredientFilterObj;
        this.sortPageObj = this.sortPageObj.update(this.filterObject);
        return this.getIngredientList();
      })
    );
  }

  getSingleIngredient(itemId: number): Observable<IIngredient> {
    this.isNew = false;
    return this.restIngredientService.getIngredientById(itemId).pipe(
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
  getIngredientList(): Observable<PagedResult<IIngredient>> {
    return this.restIngredientService.getIngredientList(this.filterObject).pipe(
      catchError((error: unknown) => {
        const err = error as HttpErrorResponse;
        this.dialogService.confirm(MessageStatus.Critical, 'Error getting ingredients', err.message);
        return of({ items: [], totalCount: 0 });
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  sortPageChange(pageEvent: ISortPageObj) {
    console.log('there was a sortPage Change heard in ingredients', pageEvent);
    this.stateService.setIngredientFilterQuery({ ...this.filterObject, ...pageEvent });
    this.sortPageObj = this.sortPageObj.update(this.filterObject);
  }
  changeTab(event: any) {
    this.selectedTab = event;
    this.filterObject.tabNumber = event;
    if (this.selectedTab === 0) {
      this.selectedIngredient$ = undefined;
      this.location.replaceState('/savoury/ingredients');
    }
    this.stateService.setIngredientFilterQuery(this.filterObject);
  }
  createOrEdit(editOrNew: string, row?: IIngredient) {
    console.log('CreateOrEdit', editOrNew, row);
    this.isNew = editOrNew === 'new';
    if (this.isNew && !!this.refData?.IngredientFoodGroup && !!this.refData.IngredientState) {
      this.dialogService
        .newIngredientDialog(this.refData.IngredientFoodGroup, this.measurements, this.refData.IngredientState)
        .pipe(
          first(),
          switchMap((result: IIngredient) => this.restIngredientService.createIngredient(result)),
          tap((savedResult: IIngredient) => {
            this.isNew = false; // ingredient is no longer "new"
            this.selectedIngredient$ = of(savedResult);
            this.changeTab(1);
          })
        )
        .subscribe();
      return;
    }
    if (!!row && row.id) {
      this.location.replaceState(`/savoury/ingredients/item/${row.id}`);
      this.selectedIngredient$ = this.getSingleIngredient(row.id);
    }
  }

  // createNewIngredient(result: any): Ingredient {
  // 	const newIngredient: Ingredient = {
  // 		name: this.toTitleCase(result.name),
  // 		// parent: result.aisle,
  // 		// consistency: result.consistency,
  // 		nutrition: [],
  // 		caloricBreakdown: {
  // 		percentProtein: result.nutrition.caloricBreakdown.percentProtein,
  // 		percentFat: result.nutrition.caloricBreakdown.percentFat,
  // 		percentCarbs: result.nutrition.caloricBreakdown.percentCarbs,
  // 		}
  // 	};
  // 	result.nutrition.nutrients.map(item => {
  // 		newIngredient.nutrition.push({
  // 		title: item.title,
  // 		amount: item.amount,
  // 		unit: item.unit,
  // 		percentOfDailyNeeds: item.percentOfDailyNeeds
  // 		});
  // 	});
  // 	return newIngredient;
  // }
  //   async getIngredients(recipes) {
  // async await with promises -
  // https://medium.com/@antonioval/making-array-iteration-easy-when-using-async-await-6315c3225838
  // map through the recipes
  //    const pArray = recipes.map(async recipe => {
  // 		// map through the ingredientLists within the recipe
  // 		const ingredArray = recipe.ingredientLists.map(async ingred => {
  // 		// if the ingredientID contains only numbers - and if the name does not exist
  // 		const checkForIngredient = this.data.items.filter(item => item.name.toLowerCase() === ingred.ingredientName.toLowerCase());
  // 		console.log('ingred', ingred.ingredientId);
  // 		if (this.filterInt(ingred.ingredientId.toString()) && checkForIngredient.length === 0) {
  // 			// fetch ingredients from spoonacular
  // 			return await this.restIngredientService.getSpoonacularIngredient(ingred.ingredientId)
  // 			.subscribe(async result => {
  // 			console.log('ingredient result', result);
  // 			// chart out the newIngredient
  // 			const newIngredient: Ingredient = this.createNewIngredient(result);
  // 			// with each return create the ingredient in CookBook and add to the current ingredientList
  // 			console.log('newIngredient to be written', newIngredient);
  // 			return await this.restIngredientService.createIngredient(newIngredient)
  // 				.subscribe(async returnedIngredient => {
  // 				return await this.restRecipeService
  // 				.updateSubRecipe(recipe._id, 'ingredientLists', ingred._id, {ingredientID: returnedIngredient._id})
  // 					.subscribe(updatedIngredientList => {
  // 					console.log('updated the associated ingredient', updatedIngredientList);
  // 					this.data.items.push(updatedIngredientList);
  // 					});
  // 				});
  // 			});
  // 		} else {
  // 			return null;
  // 		}
  // 		});
  // 		const response = await Promise.all(ingredArray);
  // 		console.log('response complete?', response);
  // 		return response;
  //    });
  //    const users = await Promise.all(pArray);
  //    console.log('users complete?', users);
  //    return users;
  //  }
  //  async cleanIngredients(recipe: Recipe) {
  // 	// map through the ingredientLists within the recipe
  // 	const pArray = recipe.ingredientLists.map(async ingred => {
  // 		// ingred .ingredientId (needs updating) .ingredientName (if matches loaded this.ingredients.name)
  // 		// using the ingred._id and recipe._id to save
  // 		const matchingIngredient = this.data.items.filter(item => item.name.toLowerCase() === ingred.ingredientName.toLowerCase());
  // 		if (matchingIngredient && matchingIngredient.length > 0 && matchingIngredient[0]._id !== ingred._id) {
  // 		console.log('we got a match', recipe.name, matchingIngredient[0]._id, ingred.ingredientName);
  // 		return await this.restRecipeService
  // 		.updateSubRecipe(recipe._id, 'ingredientLists', ingred._id, {ingredientId: matchingIngredient[0]._id})
  // 		.subscribe(updatedIngredientListItem => {
  // 				return updatedIngredientListItem;
  // 			});
  // 		} else {
  // 		console.log('no match, returning null');
  // 		return null;
  // 		}
  // 	});
  // 	const users = await Promise.all(pArray);
  // 	console.log('users complete?', users);
  // 	return users;
  //  }
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

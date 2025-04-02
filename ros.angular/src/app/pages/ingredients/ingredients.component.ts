import { Component } from '@angular/core';
import { CBlankFilter, IFilter, IIngredientFilter } from '@DomainModels/filter.dto';
import { IIngredient, IIngredientShort } from '@DomainModels/ingredient.dto';
import { SortPageObj } from '@models/common.model';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { Observable } from 'rxjs';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  standalone: false
})
export class IngredientsComponent {
  selectedIngredient$: Observable<IIngredient> | undefined;
  selectedTab = 0; // controls the selectedIndex of the mat-tab-group
  isNew = true; // edit or new ingredient;
  currentPath: string | undefined = '';
  filterObject: IFilter = CBlankFilter;
  /** !Temp - is this nEEDED? */
  sortPageObj: SortPageObj = new SortPageObj();

  constructor(
    private navigationService: NavigationService,

    public appStore: AppStore
  ) {}
  viewIngredient(ingredient: IIngredientShort) {
    this.navigationService.navigateToUrl(`${CRouteList.ingredient}/${ingredient.id}`);
  }

  /**
   * Listens to the stateService ingredient filter and updates the data in the table on change.
   */

  // getSingleIngredient(itemId: number): Observable<IIngredient> {
  //   this.isNew = false;
  //   return this.ingredientService.getIngredientById(itemId).pipe(
  //     tap((ing: IIngredient) => {
  //       this.selectedTab = 1;
  //     }),
  //     catchError((error: unknown) => {
  //       const err = error as HttpErrorResponse;
  //       this.dialogService.confirm(MessageStatus.Critical, 'Error getting ingredient', err.message);
  //       return of({} as IIngredient);
  //     }),
  //     takeUntil(this.ngUnsubscribe)
  //   );
  // }

  sortPageChange(pageEvent: IIngredientFilter) {
    console.log('there was a sortPage Change heard in ingredients', pageEvent);
    this.appStore.setIngredientFilter(pageEvent);
    // this.stateService.setIngredientFilterQuery({ ...this.filterObject, ...pageEvent });
    // this.sortPageObj = this.sortPageObj.update(this.filterObject);
  }
}

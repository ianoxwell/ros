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
  constructor(
    private navigationService: NavigationService,

    public appStore: AppStore
  ) {}

  viewIngredient(ingredient: IIngredientShort) {
    this.navigationService.navigateToUrl(`${CRouteList.ingredient}/${ingredient.id}`);
  }

  sortPageChange(pageEvent: IIngredientFilter) {
    switch (pageEvent.sort) {
      case 'carbs':
        pageEvent.sort = 'percentCarbs';
        break;
      case 'fats':
        pageEvent.sort = 'percentFat';
        break;
      case 'protein':
        pageEvent.sort = 'percentProtein';
        break;
      default:
        break;
    }
    this.appStore.setIngredientFilter(pageEvent);
  }
}

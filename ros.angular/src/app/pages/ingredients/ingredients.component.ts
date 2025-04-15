import { Component, signal } from '@angular/core';
import { IIngredientFilter } from '@DomainModels/filter.dto';
import { IIngredientShort } from '@DomainModels/ingredient.dto';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  standalone: false
})
export class IngredientsComponent {
  readonly panelOpenState = signal(false);
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

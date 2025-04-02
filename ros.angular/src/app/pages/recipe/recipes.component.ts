import { Component, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
import { IRecipeShort } from '@DomainModels/recipe.dto';
import { NavigationService } from '@services/navigation/navigation.service';
import { CRouteList } from '@services/navigation/route-list.const';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: false
})
export class RecipesComponent {
  readonly panelOpenState = signal(false);
  currentPath: string | undefined = '';
  filterQuery: IFilter = CBlankFilter;
  dataLength = 0;

  constructor(
    private navigationService: NavigationService,
    public appStore: AppStore
  ) {}

  // triggers from the MatPaginator - emits the filterQuery object
  pageChange(ev: PageEvent): void {
    if (ev.previousPageIndex !== ev.pageIndex) {
      this.appStore.setRecipeFilter({ ...this.appStore.$recipeFilter(), page: ev.pageIndex });
    } else {
      this.filterQuery.page = 0;
      this.filterQuery.take = ev.pageSize;
      this.appStore.setRecipeFilter({ ...this.appStore.$recipeFilter(), page: 0, take: ev.pageSize });
    }
  }

  selectThisRecipe(recipe: IRecipeShort) {
    this.navigationService.navigateToUrl(`${CRouteList.recipe}/${recipe.id}`);
  }

  backToRecipeView() {
    this.navigationService.navigateToUrl(`${CRouteList.recipes}`);
  }
}

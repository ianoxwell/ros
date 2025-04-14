import { Component, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CBlankFilter, IFilter } from '@DomainModels/filter.dto';
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

  constructor(public appStore: AppStore) {}

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
}

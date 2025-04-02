import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, effect } from '@angular/core';
import { ComponentBase } from '@components/base/base.component.base';
import { firstValueFrom, takeUntil, tap } from 'rxjs';
import { AppStore } from 'src/app/app.store';
import { RecipeService } from '../recipe/recipe.service';
import { IngredientService } from '../ingredients/ingredient.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: false
})
export class MainComponent extends ComponentBase {
  private takeRecipes = {
    [Breakpoints.XSmall]: 6,
    [Breakpoints.Small]: 6,
    [Breakpoints.Medium]: 8,
    [Breakpoints.Large]: 12,
    [Breakpoints.XLarge]: 16
  };

  constructor(
    private appStore: AppStore,
    private breakpointObserver: BreakpointObserver,
    private recipeService: RecipeService,
    private ingredientService: IngredientService
  ) {
    super();
    this.listenScreenSize().subscribe();
    effect(async () => {
      const recipeFilter = this.appStore.$recipeFilter();
      this.appStore.setLoadingRecipes(true);
      const recipes = await firstValueFrom(this.recipeService.getRecipe(recipeFilter));
      this.appStore.setRecipes(recipes);
      this.appStore.setLoadingRecipes(false);
    });

    effect(async () => {
      const ingredientFilter = this.appStore.$ingredientFilter();
      console.log('new ingredient filer', ingredientFilter);
      this.appStore.setLoadingIngredients(true);
      const ingredientResult = await firstValueFrom(this.ingredientService.getIngredientList(ingredientFilter));
      console.log('set the ingredientResult', ingredientResult);
      this.appStore.setIngredients(ingredientResult);
      this.appStore.setLoadingIngredients(false);
    });
  }

  listenScreenSize() {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        tap((result) => {
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              const takeSize = this.takeRecipes[query];
              if (this.appStore.$recipeFilter().take !== takeSize) this.appStore.setRecipeFilterTakeSize(takeSize);
            }
          }
        }),
        takeUntil(this.ngUnsubscribe)
      );
  }
}

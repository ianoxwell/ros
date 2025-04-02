import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IngredientsComponent } from './ingredients.component';
import { IngredientViewComponent } from './ingredient-view/ingredient-view.component';

const ingredientsRoutes = [
  {
    path: '',
    component: IngredientsComponent,
    data: { title: `Ingredients` }
  },
  {
    path: 'item/:ingredientId',
    component: IngredientViewComponent,
    data: { title: `Ingredient Edit`, symbol: `edit` }
  }
];
@NgModule({
  imports: [RouterModule.forChild(ingredientsRoutes)],
  exports: [RouterModule]
})
export class IngredientsRoutingModule {}

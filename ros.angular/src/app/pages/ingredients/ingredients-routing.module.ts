import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IngredientsComponent } from './ingredients.component';

const ingredientsRoutes = [
  {
    path: '',
    component: IngredientsComponent,
    data: { title: `Ingredients` }
  },
  {
    path: 'item/:ingredientId',
    component: IngredientsComponent,
    data: { title: `Ingredient Edit`, symbol: `edit` }
  }
];
@NgModule({
  imports: [RouterModule.forChild(ingredientsRoutes)],
  exports: [RouterModule]
})
export class IngredientsRoutingModule {}

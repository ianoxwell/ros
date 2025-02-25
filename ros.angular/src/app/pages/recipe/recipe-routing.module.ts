import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';

export const recipeRoutes = [
  {
    path: 'browse',
    component: RecipesComponent,
    data: { title: `Recipes` }
  },
  {
    path: 'item/:recipeId',
    component: RecipesComponent,
    data: { title: `Recipe` }
  }
];

@NgModule({
  imports: [RouterModule.forChild(recipeRoutes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule {}

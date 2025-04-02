import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';

const recipeRoutes = [
  {
    path: 'browse',
    component: RecipesComponent,
    data: { title: `Recipes` }
  },
  {
    path: 'item/:recipeId',
    component: RecipeViewComponent,
    data: { title: `Recipe` }
  }
];

@NgModule({
  imports: [RouterModule.forChild(recipeRoutes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule {}

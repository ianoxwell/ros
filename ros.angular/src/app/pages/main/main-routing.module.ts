import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingComponent } from '../shopping/shopping.component';
import { FavouritesComponent } from '../user/favourites/favourites.component';
import { UserRecipesComponent } from '../user/user-recipes/user-recipes.component';
import { UserSettingsComponent } from '../user/user-settings/user-settings.component';
import { MainComponent } from './main.component';
import { MainResolver } from './main.resolve';

const recipesModule = () => import('../recipe/recipes.module').then((x) => x.RecipesModule);
const ingredientsModule = () => import('../ingredients/ingredients.module').then((x) => x.IngredientsModule);

const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    resolve: {
      references: MainResolver
    },
    children: [
      {
        path: 'ingredients',
        loadChildren: ingredientsModule
      },
      {
        path: 'recipes',
        loadChildren: recipesModule
      },
      {
        path: 'recipes',
        redirectTo: 'recipes/browse',
        pathMatch: 'full'
      },
      {
        path: 'shopping',
        component: ShoppingComponent,
        data: { title: `Shopping list` }
      },
      {
        path: 'user/settings',
        component: UserSettingsComponent,
        data: { title: `My Settings` }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}

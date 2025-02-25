import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { IngredientsComponent } from '../ingredients/ingredients.component';
import { RecipesComponent } from '../recipe/recipes.component';
import { ShoppingComponent } from '../shopping/shopping.component';
import { FavouritesComponent } from '../user/favourites/favourites.component';
import { UserRecipesComponent } from '../user/user-recipes/user-recipes.component';
import { UserSettingsComponent } from '../user/user-settings/user-settings.component';
import { MainComponent } from './main.component';

const recipesModule = () => import('../recipe/recipes.module').then((x) => x.RecipesModule);
const ingredientsModule = () => import('../ingredients/ingredients.module').then((x) => x.IngredientsModule);

const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: `Provisioner's Cookbook` }
      },
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
        path: 'user/favourites',
        component: FavouritesComponent,
        data: { title: `Favourites list` }
      },
      {
        path: 'user/recipes',
        component: UserRecipesComponent,
        data: { title: `My Recipes` }
      },
      {
        path: 'user/settings',
        component: UserSettingsComponent,
        data: { title: `My Settings` }
      }
      // {
      // 	path: 'app/settings',
      // 	component: ScriptsComponent,
      // 	data: { title: `App Settings` }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}

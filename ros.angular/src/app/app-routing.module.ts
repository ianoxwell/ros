import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { MainComponent } from './pages/main/main.component';
import { RecipesComponent } from './pages/recipe/recipes.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { FavouritesComponent } from './pages/user/favourites/favourites.component';
import { UserRecipesComponent } from './pages/user/user-recipes/user-recipes.component';
import { UserSettingsComponent } from './pages/user/user-settings/user-settings.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { InterceptorService } from './services/interceptor.service';

const accountModule = () => import('@components/account/account.module').then((x) => x.AccountModule);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: 'account',
        loadChildren: accountModule
      }
    ]
  },
  {
    path: 'savoury',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: `Provisioner's Cookbook` }
      },
      {
        path: 'ingredients',
        component: IngredientsComponent,
        data: { title: `Ingredients` }
      },
      {
        path: 'ingredients/item/:ingredientId',
        component: IngredientsComponent,
        data: { title: `Ingredient Edit`, symbol: `edit` }
      },
      {
        path: 'recipes/browse',
        component: RecipesComponent,
        data: { title: `Recipes` }
      },
      {
        path: 'recipes/item/:recipeId',
        component: RecipesComponent,
        data: { title: `Recipe` }
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
    ],
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule {}

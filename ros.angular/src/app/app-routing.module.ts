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
import { ForgotPasswordComponent } from '@components/account/forgot-password/forgot-password.component';
import { LoginFormComponent } from '@components/account/login-form/login-form.component';
import { RegisterFormComponent } from '@components/account/register-form/register-form.component';
import { ResetPasswordFormComponent } from '@components/account/reset-password-form/reset-password-form.component';
import { VerifyEmailComponent } from '@components/account/verify-email/verify-email.component';


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
        children: [
          { path: 'login', component: LoginFormComponent },
          { path: 'register', component: RegisterFormComponent },
          { path: 'verify-email', component: VerifyEmailComponent },
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'reset-password', component: ResetPasswordFormComponent }
        ]
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
      initialNavigation: 'enabledNonBlocking',
      paramsInheritanceStrategy: 'always'
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

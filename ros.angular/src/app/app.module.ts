import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteSearchComponent } from '@components/auto-complete-search/auto-complete-search.component';
import { FooterComponent } from '@components/footer/footer.component';
import { SiteLogoComponent } from '@components/site-logo/site-logo.component';
import { AccountService } from '@services/account.service';
import { LogService } from '@services/log.service';
import { LoginService } from '@services/login/login.service';
import { MessageService } from '@services/message.service';
import { RefDataService } from '@services/ref-data.service';
import { ReferenceService } from '@services/reference.service';
import { RestIngredientService } from '@services/rest-ingredient.service';
import { SecurityService } from '@services/security.service';
import { StateService } from '@services/state.service';
import { StorageService } from '@services/storage/storage.service';
import { UserService } from '@services/user.service';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { CompleteMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeDashboardComponent } from './pages/home/home-dashboard/home-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { MainComponent } from './pages/main/main.component';
import { RecipesComponent } from './pages/recipe/recipes.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { FavouritesComponent } from './pages/user/favourites/favourites.component';
import { UserRecipesComponent } from './pages/user/user-recipes/user-recipes.component';
import { UserSettingsComponent } from './pages/user/user-settings/user-settings.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DialogService } from './services/dialog.service';
import { UserProfileService } from './services/user-profile.service';

import { ForgotPasswordComponent } from '@components/account/forgot-password/forgot-password.component';
import { LoginFormComponent } from '@components/account/login-form/login-form.component';
import { LoginComponent } from '@components/account/login.component';
import { RegisterFormComponent } from '@components/account/register-form/register-form.component';
import { ResetPasswordFormComponent } from '@components/account/reset-password-form/reset-password-form.component';
import { VerifyEmailComponent } from '@components/account/verify-email/verify-email.component';
import { AppHeaderComponent } from '@components/app-header/app-header.component';
import { GraphDoughnutComponent } from '@components/graph-doughnut/graph-doughnut.component';
import { IconTextComponent } from '@components/icon-text/icon-text.component';
import { EditCommonMineralsComponent } from 'src/app/pages/ingredients/edit-common-minerals/edit-common-minerals.component';
import { EditCommonVitaminsComponent } from 'src/app/pages/ingredients/edit-common-vitamins/edit-common-vitamins.component';
import { EditIngredientBasicComponent } from 'src/app/pages/ingredients/edit-ingredient-basic/edit-ingredient-basic.component';
import { EditIngredientNutritionComponent } from 'src/app/pages/ingredients/edit-ingredient-nutrition/edit-ingredient-nutrition.component';
import { IngredientConversionFormComponent } from 'src/app/pages/ingredients/ingredient-conversion-form/ingredient-conversion-form.component';
import { IngredientPricesFormComponent } from 'src/app/pages/ingredients/ingredient-prices-form/ingredient-prices-form.component';
import { IngredientEditComponent } from 'src/app/pages/ingredients/ingredient-edit/ingredient-edit.component';
import { IngredientFilterComponent } from 'src/app/pages/ingredients/ingredient-filter/ingredient-filter.component';
import { IngredientTableComponent } from 'src/app/pages/ingredients/ingredient-table/ingredient-table.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { RecipeCardComponent } from 'src/app/pages/recipe/recipe-card/recipe-card.component';
import { RecipeViewComponent } from 'src/app/pages/recipe/recipe-view/recipe-view.component';
import { SearchBarComponent } from 'src/app/pages/recipe/search-bar/search-bar.component';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { ToastItemComponent } from '@components/toast/toast-item/toast-item.component';
import { ToastComponent } from '@components/toast/toast.component';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { SentenceCasePipe } from '@pipes/sentence-case.pipe';
import { ToTitleCasePipe } from '@pipes/title-case.pipe';
import { ConfirmDialogComponent } from './dialogs/dialog-confirm/confirm.component';
import { DialogDeleteIngredientComponent } from './dialogs/dialog-delete-ingredient/dialog-delete-ingredient.component';
import { DialogErrorComponent } from './dialogs/dialog-error/dialog-error.component';
import { DialogIngredientMatchComponent } from './dialogs/dialog-ingredient-match/dialog-ingredient-match.component';
import { DialogNewIngredientComponent } from './dialogs/dialog-new-ingredient/dialog-new-ingredient.component';
import { DialogRecipeComponent } from './dialogs/dialog-recipe/dialog-recipe.component';
import { FormAutocompleteDirective } from './directives/form-autocomplete.directive';
import { MatInputAutoCompleteDirective } from './directives/mat-input-autocomplete.directive';

@NgModule({
  declarations: [
    AppComponent,
    FavouritesComponent,
    RecipesComponent,
    ShoppingComponent,
    IngredientsComponent,
    UserSettingsComponent,
    UserRecipesComponent,
    HomeComponent,
    HomeDashboardComponent,
    MainComponent,
    WelcomeComponent,
    DialogErrorComponent,
    DialogDeleteIngredientComponent,
    DialogRecipeComponent,
    DialogNewIngredientComponent,
    ConfirmDialogComponent,
    DialogIngredientMatchComponent,
    SaveButtonComponent,
    LoadingIndicatorComponent,
    AutoCompleteSearchComponent,
    SiteLogoComponent,
    FooterComponent,
    SearchBarComponent,
    RecipeCardComponent,
    RecipeViewComponent,
    AppHeaderComponent,
    IngredientEditComponent,
    IngredientFilterComponent,
    IconTextComponent,
    IngredientTableComponent,
    IngredientPricesFormComponent,
    IngredientConversionFormComponent,
    PageTitleComponent,
    EditIngredientBasicComponent,
    EditCommonMineralsComponent,
    EditCommonVitaminsComponent,
    EditIngredientNutritionComponent,
    FormAutocompleteDirective,
    MatInputAutoCompleteDirective,
    GraphDoughnutComponent,
    PaginatorComponent,
    ToTitleCasePipe,
    SafeHtmlPipe,
    SentenceCasePipe,
    LoginFormComponent,
    RegisterFormComponent,
    ResetPasswordFormComponent,
    ForgotPasswordComponent,
    LoginComponent,
    VerifyEmailComponent,
    ToastItemComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CompleteMaterialModule,
    SocialLoginModule,
    LayoutModule,
    DigitOnlyModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
    AccountService,
    RestIngredientService,
    UserProfileService,
    ReferenceService,
    RefDataService,
    DialogService,
    LogService,
    LoginService,
    StorageService,
    SecurityService,
    MessageService,
    UserService,
    StateService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('74967204697-o4tb5b59r1ou0vig4eoks4lst8c4i7vc.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig
    },
    ToTitleCasePipe,
    SentenceCasePipe,
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

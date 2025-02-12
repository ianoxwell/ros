import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteSearchComponent } from '@components/auto-complete-search/auto-complete-search.component';
import { ComponentModule } from '@components/component.module';
import { FooterComponent } from '@components/footer/footer.component';
import { SharedComponentModule } from '@components/shared-component.module';
import { SiteLogoComponent } from '@components/site-logo/site-logo.component';
import { PipesModule } from '@pipes/pipes.module';
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
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CompleteMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from './dialogs/dialogs.module';
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
    AutoCompleteSearchComponent,
    SiteLogoComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    CompleteMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    ComponentModule,
    DialogModule,
    PipesModule,
    SharedComponentModule,
    NgxMaterialTimepickerModule,
    NgxMaterialTimepickerModule.setLocale('en-au'),
    SocialLoginModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

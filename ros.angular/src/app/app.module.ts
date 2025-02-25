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
import { SiteLogoComponent } from '@components/site-logo/site-logo.component';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { CompleteMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeDashboardComponent } from './pages/home/home-dashboard/home-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { FavouritesComponent } from './pages/user/favourites/favourites.component';
import { UserRecipesComponent } from './pages/user/user-recipes/user-recipes.component';
import { UserSettingsComponent } from './pages/user/user-settings/user-settings.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DialogService } from './services/dialog.service';

import { ForgotPasswordComponent } from '@components/account/forgot-password/forgot-password.component';
import { LoginFormComponent } from '@components/account/login-form/login-form.component';
import { LoginComponent } from '@components/account/login.component';
import { RegisterFormComponent } from '@components/account/register-form/register-form.component';
import { ResetPasswordFormComponent } from '@components/account/reset-password-form/reset-password-form.component';
import { VerifyEmailComponent } from '@components/account/verify-email/verify-email.component';
import { AppHeaderComponent } from '@components/app-header/app-header.component';
import { IconTextComponent } from '@components/icon-text/icon-text.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { ToastItemComponent } from '@components/toast/toast-item/toast-item.component';
import { ToastComponent } from '@components/toast/toast.component';
import { DialogModule } from './dialogs/dialogs.module';
import { FormAutocompleteDirective } from './directives/form-autocomplete.directive';
import { MatInputAutoCompleteDirective } from './directives/mat-input-autocomplete.directive';
import { SkipToMainComponent } from '@components/skip-to-main/skip-to-main.component';

@NgModule({
  declarations: [
    AppComponent,
    FavouritesComponent,
    ShoppingComponent,
    UserSettingsComponent,
    UserRecipesComponent,
    HomeComponent,
    HomeDashboardComponent,
    WelcomeComponent,
    AutoCompleteSearchComponent,
    SiteLogoComponent,
    IconTextComponent,

    FormAutocompleteDirective,
    MatInputAutoCompleteDirective,
    LoginFormComponent,
    RegisterFormComponent,
    ResetPasswordFormComponent,
    ForgotPasswordComponent,
    LoginComponent,
    VerifyEmailComponent,
    ToastItemComponent,
    ToastComponent,
    
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
    DigitOnlyModule,
    DialogModule,
    LoadingIndicatorComponent,
    SaveButtonComponent,
    PageTitleComponent,
    SkipToMainComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
    DialogService,
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
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

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

import { ShoppingComponent } from './pages/shopping/shopping.component';
import { FavouritesComponent } from './pages/user/favourites/favourites.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DialogService } from './services/dialog.service';

import { IconTextComponent } from '@components/icon-text/icon-text.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { SkipToMainComponent } from '@components/skip-to-main/skip-to-main.component';
import { ToastItemComponent } from '@components/toast/toast-item/toast-item.component';
import { ToastComponent } from '@components/toast/toast.component';
import { DialogModule } from './dialogs/dialogs.module';
import { FormAutocompleteDirective } from './directives/form-autocomplete.directive';
import { MatInputAutoCompleteDirective } from './directives/mat-input-autocomplete.directive';
import { AccountModule } from './pages/account/account.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FavouritesComponent,
    ShoppingComponent,
    WelcomeComponent,
    AutoCompleteSearchComponent,
    SiteLogoComponent,
    IconTextComponent,

    FormAutocompleteDirective,
    MatInputAutoCompleteDirective,
    ToastItemComponent,
    ToastComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
    DigitOnlyModule,
    DialogModule,
    AccountModule,
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

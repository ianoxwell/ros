import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ShoppingComponent } from './pages/shopping/shopping.component';
import { FavouritesComponent } from './pages/user/favourites/favourites.component';
import { DialogService } from './services/dialog.service';

import { RouterModule } from '@angular/router';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { SaveButtonComponent } from '@components/save-button/save-button.component';
import { SkipToMainComponent } from '@components/skip-to-main/skip-to-main.component';
import { ToastModule } from '@components/toast/toast.module';
import { DialogModule } from './dialogs/dialogs.module';
import { FormAutocompleteDirective } from './directives/form-autocomplete.directive';
import { MatInputAutoCompleteDirective } from './directives/mat-input-autocomplete.directive';
import { AccountModule } from './pages/account/account.module';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    AppComponent,
    FavouritesComponent,
    ShoppingComponent,
    FormAutocompleteDirective,
    MatInputAutoCompleteDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    A11yModule,
    ReactiveFormsModule,
    SocialLoginModule,
    DigitOnlyModule,
    DialogModule,
    AccountModule,
    LoadingIndicatorComponent,
    SaveButtonComponent,
    PageTitleComponent,
    SkipToMainComponent,
    ToastModule
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

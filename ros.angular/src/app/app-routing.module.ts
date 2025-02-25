import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from '@components/account/forgot-password/forgot-password.component';
import { LoginFormComponent } from '@components/account/login-form/login-form.component';
import { RegisterFormComponent } from '@components/account/register-form/register-form.component';
import { ResetPasswordFormComponent } from '@components/account/reset-password-form/reset-password-form.component';
import { VerifyEmailComponent } from '@components/account/verify-email/verify-email.component';
import { AuthGuard } from './guards/auth.guard';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { InterceptorService } from './services/interceptor.service';


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
    loadChildren: () => import('./pages/main/main.component').then(m => m.MainComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledNonBlocking',
      preloadingStrategy: PreloadAllModules,
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

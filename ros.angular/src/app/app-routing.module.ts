import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/pages/account/forgot-password/forgot-password.component';
import { LoginFormComponent } from 'src/app/pages/account/login-form/login-form.component';
import { RegisterFormComponent } from 'src/app/pages/account/register-form/register-form.component';
import { ResetPasswordFormComponent } from 'src/app/pages/account/reset-password-form/reset-password-form.component';
import { VerifyEmailComponent } from 'src/app/pages/account/verify-email/verify-email.component';
import { AuthGuard } from './guards/auth.guard';
import { InterceptorService } from './services/interceptor.service';
import { LoginComponent } from './pages/account/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/login',
    pathMatch: 'full'
  },
  {
    path: 'account',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginFormComponent },
      { path: 'register', component: RegisterFormComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordFormComponent }
    ]
  },
  {
    path: 'savoury',
    loadChildren: () => import('./pages/main/main.module').then((m) => m.MainModule),
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

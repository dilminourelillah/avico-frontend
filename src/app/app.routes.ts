import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'new-cycle',
    loadComponent: () => import('./new-cycle/new-cycle.page').then(m => m.NewCyclePage)
  },
  {
    path: 'verify',
    loadComponent: () => import('./verify/verify.page').then(m => m.VerifyPage)
  },
  {
    path: 'daily-history', // ✅ تعريف صحيح للصفحة الجديدة
    loadComponent: () => import('./daily-history/daily-history.page').then(m => m.DailyHistoryPage)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'splash',
    pathMatch: 'full',
  }
];

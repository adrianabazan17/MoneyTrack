import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'movimientos',
    loadComponent: () => import('./pages/movimientos/movimientos.page').then( m => m.MovimientosPage)
  },
  {
    path: 'movimiento-form',
    loadComponent: () => import('./pages/movimiento-form/movimiento-form.page').then( m => m.MovimientoFormPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'editar-movimiento/:id',
    loadComponent: () => import('./pages/editar-movimiento/editar-movimiento.page').then( m => m.EditarMovimientoPage)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.page').then( m => m.ReportesPage)
  },
  {
    path: 'objetivos',
    loadComponent: () => import('./pages/objetivos/objetivos.page').then( m => m.ObjetivosPage)
  },
  {
    path: 'objetivo-form',
    loadComponent: () => import('./pages/objetivo-form/objetivo-form.page').then( m => m.ObjetivoFormPage)
  },

  {
    path: 'objetivo-form/:id',
    loadComponent: () =>
      import('./pages/objetivo-form/objetivo-form.page').then(
        m => m.ObjetivoFormPage
      )
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  
];

import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'pessoas',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: 'pessoas',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'}
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'pessoas',
        loadChildren: () => import('./views/pessoas/pessoas.module').then(m => m.PessoasModule),
        data: { title: 'Pessoas', breadcrumb: 'Pessoas'}
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];

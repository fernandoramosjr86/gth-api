import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SigninComponent } from './signin/signin.component';

export const SessionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        data: { title: 'Entrar' }
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'Página não encontrada' }
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  }
];

import { Routes } from '@angular/router';
import { PessoasComponent } from './pessoas.component';

export const PessoasRoutes: Routes = [
  {
    path: '',
    component: PessoasComponent,
    data: { title: 'Pessoas', breadcrumb: 'Pessoas' }
  }
];

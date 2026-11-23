import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'secuencias',
    loadComponent: () =>
      import('./features/secuencias/pages/secuencia-page/secuencia-page')
        .then(m => m.SecuenciasPage)
  },
  {
    path: '',
    redirectTo: 'secuencias',
    pathMatch: 'full'
  }
];

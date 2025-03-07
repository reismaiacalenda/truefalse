import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RecursosAlocadosComponent } from './theme/pages/default/reservas/recursos-alocados/recursos-alocados.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'logout', component: LogoutComponent },
  { path: 'i', loadChildren: () => import('./agendador/agendador.module').then(m => m.AgendadorModule) },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'recursos-alocados', component: RecursosAlocadosComponent },

  // { path: ':workspace', loadChildren: './auth/auth.module#AuthModule' }
];

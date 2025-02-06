import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  //{ path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  //{ path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },

];

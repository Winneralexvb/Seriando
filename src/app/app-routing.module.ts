import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2/tab2.page';
import { Tab1Page } from './tab1/tab1.page';
import { Tab3Page } from './tab3/tab3.page';
import { Tab4Page } from './tab4/tab4.page';
import { DetailspageComponent } from './components/detailspage/detailspage.component';
import { authGuard } from './guards/auth.guard';
import { EntrarComponent } from './auth/login/entrar/entrar.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [authGuard],
  },
  { path: '', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  { path: 'tab1', component: Tab1Page },
  { path: 'tab2', component: Tab2Page },
  { path: 'tab3', component: Tab3Page },
  { path: 'tab4', component: Tab4Page },
  { path: 'details/:id/:mediaType', component: DetailspageComponent },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  { path: 'entrar', component: EntrarComponent },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recover',
    loadChildren: () => import('./auth/recover/recover.module').then( m => m.RecoverPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

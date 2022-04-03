import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './core/content-pages/content-layout/content-layout.component';
import { HomeLayoutComponent } from './core/home/home-layout/home-layout.component';
import data from '../assets/data.json';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WildCardGuardService } from './core/services/wild-card-guard.service';

const routes: Routes = [
  {
    path: ':country',
    loadChildren: () =>
      import('./core/content-pages/content-pages.module').then(
        (m) => m.ContentPagesModule
      ),
    component: ContentLayoutComponent,
    canActivateChild: [WildCardGuardService]
  },
  {
    path: `${data.countryRegion}`,
    loadChildren: () =>
      import('./core/auth/auth.module')
        .then((m) => m.AuthModule)
        .catch((error) => {
          console.log('err in routing', error);
        }),
    component: AuthLayoutComponent,
    canActivateChild: [WildCardGuardService]
  },
  {
    path: `${data.countryRegion}/user`,
    loadChildren: () =>
      import('./core/home/home.module').then((m) => m.HomeModule),
    component: HomeLayoutComponent,
    canActivateChild: [WildCardGuardService]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('countryCode') || 'my',
  },
  {
    path: `${data.countryRegion}/page-not-found`,
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

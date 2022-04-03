import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { MainHomeComponent } from './pages/User-dashboard/main-home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AddAddressComponent } from 'src/app/shared/components/add-address/add-address.component';
import { OrderDetailComponent } from 'src/app/core/home/pages/order-detail/order-detail.component';
import { QuotationComponent } from 'src/app/core/home/pages/quotation/quotation.component';
import { QuoteDetailComponent } from 'src/app/core/home/pages/quote-detail/quote-detail.component';
import { CountryIsoService } from '../../../app/core/services/country-iso.service';
import { AuthGuard } from '../services/auth-guard.service';
const routes: Routes = [{

  path: '',
  children: [
    {
      path: '',
      component: HomeLayoutComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        },
        {
          path: 'dashboard',
          component: MainHomeComponent,
        },
        {
          path: 'profile',
          component: ProfileComponent,
        },
        {
          path: 'orders',
          component: OrdersComponent,
        },
        {
          path: `orders/:id`,
          component: OrderDetailComponent,
        },
        {
          path: 'quotations',
          component: QuotationComponent
        },
        {
          path: 'quotation-detail/:id',
          component: QuoteDetailComponent
        },
        {
          path: 'wishlist',
          component: WishlistComponent,
        },
        {
          path: ':id/edit',
          component: AddAddressComponent,
        }
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainHomeComponent } from './pages/User-dashboard/main-home.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { QuotationComponent } from './pages/quotation/quotation.component';
import { QuoteDetailComponent } from './pages/quote-detail/quote-detail.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

 
@NgModule({
  declarations: [
    MainHomeComponent, 
    HomeLayoutComponent, 
    ProfileComponent, 
    WishlistComponent, 
    OrdersComponent, 
    OrderDetailComponent, 
    QuotationComponent, 
    QuoteDetailComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    HomeRoutingModule,
    NgxSkeletonLoaderModule
  ],
})
export class HomeModule { }

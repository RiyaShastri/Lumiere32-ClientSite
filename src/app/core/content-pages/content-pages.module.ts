import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';
import { ContentPagesRoutingModule } from './content-pages-routing.module';
import { LandingComponent } from './pages/landing/landing.component';
import { SharedModule } from '../../shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalEquipmentComponent } from './pages/Medical/medical-equipment.component';
import { GetEquipmentComponent } from './pages/Product-listing/get-equipment.component';
import { DentalEquipmentComponent } from './pages/Dental/dental-equipment.component';
import { PaginatorModule } from 'primeng/paginator';
import { VerticalFilterBarComponent } from '../vertical-filter-bar/vertical-filter-bar.component';
import { CheckboxFilterComponent } from '../vertical-filter-bar/checkbox-filter/checkbox-filter.component';
import { RangeFilterComponent } from '../vertical-filter-bar/range-filter/range-filter.component';
import { KeywordFilterComponent } from '../vertical-filter-bar/keyword-filter/keyword-filter.component';
import { ShowMoreModalComponent } from '../vertical-filter-bar/checkbox-filter/show-more-modal/show-more-modal.component';
import { SliderModule } from 'primeng/slider';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { TabViewModule } from 'primeng/tabview';
import { FilterResultsComponent } from '../filter-results/filter-results.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { AddToCartComponent } from './pages/add-to-cart/add-to-cart.component';
import { DialogModule } from 'primeng/dialog';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { NgxBraintreeModule } from 'ngx-braintree';
import { HttpClientModule } from '@angular/common/http';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ThankyouComponent } from './pages/thankyou/thankyou.component';
import { FailpageComponent } from './pages/failpage/failpage.component';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module } from 'ng-recaptcha';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MywalletComponent } from './pages/mywallet/mywallet.component';
import { AddMoneyComponent } from './pages/add-money/add-money.component';
import { SiteFilterComponent } from './pages/site-filter/site-filter.component';
import { ConcentratorComponent } from './pages/concentrator/concentrator/concentrator.component';
import { CategoriesListingComponent } from './pages/categories-listing/categories-listing.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { Meta } from '@angular/platform-browser';
import { TopUpWalletComponent } from './pages/top-up-wallet/top-up-wallet.component';
import { OffersComponent } from './pages/offers/offers.component';
import { RewardsComponent } from './pages/rewards/rewards.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrandsComponent } from './pages/brands/brands.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PanelModule } from 'primeng/panel';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SellOnLumiereComponent } from './sell-on-lumiere/sell-on-lumiere.component';
import { PaymentOptionComponent } from './pages/payment-option/payment-option.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    LandingComponent,
    MedicalEquipmentComponent,
    GetEquipmentComponent,
    DentalEquipmentComponent,
    VerticalFilterBarComponent,
    FilterResultsComponent,
    CheckboxFilterComponent,
    RangeFilterComponent,
    KeywordFilterComponent,
    ShowMoreModalComponent,
    ProductDetailComponent,
    AddToCartComponent,
    CheckoutComponent,
    ContactUsComponent,
    AboutUsComponent,
    ThankyouComponent,
    FailpageComponent,
    MywalletComponent,
    AddMoneyComponent,
    SiteFilterComponent,
    ConcentratorComponent,
    CategoriesListingComponent,
    TopUpWalletComponent,
    OffersComponent,
    RewardsComponent,
    BrandsComponent,
    SellOnLumiereComponent,
    PaymentOptionComponent
  ],
  imports: [
    CommonModule,
    NgxPayPalModule,
    SlickCarouselModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
    NgxBraintreeModule,
    MDBBootstrapModule.forRoot(),
    SharedModule, PaginatorModule,
    ContentPagesRoutingModule,
    TableModule,
    CheckboxModule,
    ConfirmDialogModule,
    SliderModule,
    FormsModule,
    TabViewModule,
    DropdownModule,
    DialogModule,
    Ng2SearchPipeModule,
    ContextMenuModule.forRoot(),
    MatProgressSpinnerModule,
    PanelModule,
    NgxSkeletonLoaderModule,
    RecaptchaV3Module,
    CarouselModule,
  ],
  exports: [
    PaymentOptionComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    ConfirmationService,
    MessageService,
    Meta
  ]
})
export class ContentPagesModule { }

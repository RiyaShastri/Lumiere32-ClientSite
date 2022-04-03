import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "../modules/material-ui.module"
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { NgOtpInputModule } from 'ng-otp-input';
import { FooterComponent } from './footer/footer.component';
import { PostLoginHeaderComponent } from './components/post-login-header/post-login-header.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
// import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { SavedPaymentDetailsComponent } from 'src/app/shared/components/saved-payment-details/saved-payment-details.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { RouterModule } from '@angular/router';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { BillingAddressComponent } from './components/billing-address/billing-address.component';
import { MobileUpdatesComponent } from './components/mobile-updates/mobile-updates.component';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { ButtonModule } from 'primeng/button';
// import { CardDetailsComponent } from './components/card-details/card-details.component';
import { SuccessComponent } from './components/success/success.component';
import { CommonAddressComponent } from './components/common-address/common-address.component';
import { CountdownModule } from 'ngx-countdown';
import { NgAisModule } from 'angular-instantsearch';
import { SearchComponent } from './components/search/search.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { CommingSoonComponent } from './components/comming-soon/comming-soon.component';
import { TermOfUseComponent } from './components/term-of-use/term-of-use.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { OxygenCheckoutComponent } from './components/oxygen-checkout/oxygen-checkout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HeaderComponent,
    SanitizeHtmlPipe,
    ForgotPasswordDialogComponent,
    FooterComponent,
    PostLoginHeaderComponent,
    ChangePasswordComponent,
    SavedPaymentDetailsComponent,
    AddAddressComponent,
    BillingAddressComponent,
    MobileUpdatesComponent,
    DeliveryAddressComponent,
    PaymentMethodComponent,
    // CardDetailsComponent,
    SuccessComponent,
    CommonAddressComponent,
    SearchComponent,
    CommingSoonComponent,
    TermOfUseComponent,
    PrivacyPolicyComponent,
    OxygenCheckoutComponent,
    LoaderComponent
  ],
  imports: [
    NgxPayPalModule,
    RouterModule,
    CommonModule,
    CountdownModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    AccordionModule,
    DialogModule,
    ButtonModule,
    MaterialModule,
    CheckboxModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SlickCarouselModule,
    ToastrModule.forRoot(),
    NgAisModule,
    NgxLoadingModule.forRoot({}),
    NgOtpInputModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    RouterModule,
    HeaderComponent,
    PostLoginHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    SuccessComponent,
    ButtonModule,
    AccordionModule,
    DialogModule,
    CheckboxModule,
    PaymentMethodComponent,
    // CommingSoonComponent,
    SlickCarouselModule,
    MaterialModule,
    ToastrModule,
    NgxLoadingModule,
    NgOtpInputModule,
    FooterComponent,
    SanitizeHtmlPipe,
    BillingAddressComponent,
    DeliveryAddressComponent,
    // CardDetailsComponent,
    CommonAddressComponent,
    MobileUpdatesComponent,
    CountdownModule,
    SearchComponent,
    LoaderComponent
  ]
})
export class SharedModule { }

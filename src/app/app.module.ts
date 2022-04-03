import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ContentLayoutComponent } from './core/content-pages/content-layout/content-layout.component';
import { ContentPagesModule } from './core/content-pages/content-pages.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './core/home/home.module';

import { TokenAuthentication } from './core/services/token.authentication.service';
import { AuthGuard } from './core/services/auth-guard.service';
import { EncrDecrServiceService } from './core/services/encr-decr-service.service';
import { NgAisModule } from 'angular-instantsearch';
import { TokenInterceptorService } from './core/services/token-interceptor.service';
import { AuthService } from './core/services/auth.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AlertModule } from './_alert';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ContentLayoutComponent,
    PageNotFoundComponent,

  ],
  imports: [
    BrowserModule,
    AlertModule,
    AppRoutingModule,
    //  AccordionModule,
    AuthModule,
    HomeModule,
    ContentPagesModule,
    SharedModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgbModule,
    HttpClientModule,
    NgAisModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
  ],
  exports: [
    NgbModule
  ],

  providers: [
    EncrDecrServiceService,
    TokenAuthentication,
    AuthGuard,
    AuthService,
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    //   {
    //      provide: HTTP_INTERCEPTORS, useClass: BackendInterceptor, multi: true
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

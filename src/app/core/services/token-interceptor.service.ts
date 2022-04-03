import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CountryIsoService } from './country-iso.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  sessionCount: number = 0;
  constructor(
    private injector: Injector,
    private toastrService: ToastrService
  ) {}
  intercept(req, next) {
    let authService = this.injector.get(AuthService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return next.handle(tokenizedReq).pipe(
      map((event: HttpEvent<any>) => {
        this.sessionCount = 0;
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        console.log('first===>', error.status);
        // console.log("second===>", error?.error.message.search('Invalid Card'))
        console.log('second===>', error?.error === 'Unauthorized');
        // console.log("third===>",this.sessionCount)

        if (
          error.status === 401 &&
          (error?.error === 'Unauthorized' ||
            error?.error?.message.search('Invalid Card') < 0) &&
          this.sessionCount == 0
        ) {
          this.sessionCount++;
          this.toastrService.info('Please login again!', 'Session Expired');
          this.logout(authService);
        }
        return throwError(error);
      })
    );
  }

  logout(authService) {
    authService.loggedInCustomerName = 'Login / Signup';
    authService.loginFlag = false;
    authService.showPrice = false;
    let counrtyIso = this.injector.get(CountryIsoService);
    let router = this.injector.get(Router);
    router.navigate([`/${counrtyIso.getCountryCode()}/login`]).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      counrtyIso.getSelectedCountryObject(router.url.split('/')[1]);
      localStorage.setItem(
        'countryCode',
        counrtyIso.selectedCountry[0].alphaCode
      );
    });
  }
}

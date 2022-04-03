
// import { Injectable } from '@angular/core';
// import { Router, CanActivate } from '@angular/router';
// import { TokenAuthentication } from './token.authentication.service';


// @Injectable({
//   providedIn: 'root'
// }) export class AuthGuardService implements CanActivate {
//   constructor(public auth: TokenAuthentication, public router: Router) { }

//   canActivate(): boolean {
//     if (!this.auth.isAuthenticated()) {
//       this.router.navigate(['auth/login']);
//       return false;
//     }
//     return true;
//   }
// }


import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenAuthentication } from './token.authentication.service';


@Injectable({
  providedIn: 'root'
}) export class AuthGuard implements CanActivate {

  constructor(
    public auth: TokenAuthentication, public router: Router,
    private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = window.localStorage.getItem('token');
    const countryCOde = localStorage.getItem('countryCode');

    if (token) {

      const userData = JSON.parse(localStorage.getItem('UserData'));

      if (userData && userData.hasOwnProperty('body')) {
        window.localStorage.removeItem('UserData');
        window.localStorage.removeItem('token');
        this.router.navigate([`/${countryCOde}/login`]);
        this.authService.changeURL(state.url);
        this.authService.loggedInCustomerName = 'Login / Signup';
        this.authService.loginFlag = false;
        this.authService.showPrice = false;
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigate([`/${countryCOde}/login`]);
      this.authService.changeURL(state.url);
      return false;
    }


  }
}


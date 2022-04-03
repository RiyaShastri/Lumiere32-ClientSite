import { Injectable, EventEmitter } from '@angular/core';
import { BaseService } from './base.service';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string;
  checkByEmailUrl = "checkByEmail";
  registerUrl = "register";
  verifyOtpUrl = "verifyOTP"
  resendOtpUrl = "resendOTP";
  forgotPassworsUrl = "forgetPassword";
  onResetpasswordUrl = "resetpassword";

  private emailIdLogIn: string;
  private emailIdSignUp: string;
  redirectToProduct$ = new BehaviorSubject<any>({})
  loggedInCustomerName = "Login / Signup";
  loginFlag: boolean = false;
  showPrice: boolean = true;
  loginData: string;
  baseUrlCountry: string;
  forgotPassPage: boolean = false;
  initialButton: boolean = true
  routePay32: boolean = false
  noVerifyUsername: any;   //newly added code
  noVerifyPassword: any;   //newly added code


  private sourceUrl = new BehaviorSubject('');
  currentURL = this.sourceUrl.asObservable();

  constructor(
    private http: HttpClient,
    private baseService: BaseService,
    private router: Router,
  ) {
    this.baseUrl = this.baseService.baseUrl;
    this.baseUrlCountry = this.baseService.baseUrlCountry;
    this.forgotPassPage = false;
  }

  changeURL(message: string) {
    this.sourceUrl.next(message);
  }

  getToken() {
    return localStorage.getItem('token')
  }
  onRegisterScreen1(email: string) {
    this.emailIdSignUp = email;
    return this.baseService.post(this.checkByEmailUrl, { "Email": email })
  }

  onRegisterScreen2(data) {
    return this.baseService.post(this.registerUrl, data)
  }

  onVerifyOtpSignUp(otp: string) {

    return this.http.post(this.baseUrl + this.verifyOtpUrl, { "Email": this.emailIdSignUp, "otp": otp }, { observe: 'response' })
  }

  onVerifyOtpLogIn(otp: string) {
    return this.baseService.post(this.verifyOtpUrl + `?forgotPassword=${this.forgotPassPage}`, { "Email": this.emailIdLogIn, "otp": otp })
  }

  onResendOtpLogIn() {
    return this.baseService.post(this.resendOtpUrl, { "Email": this.emailIdLogIn })
  }

  onResendOtpSignUp() {
    return this.baseService.post(this.resendOtpUrl, { "Email": this.emailIdSignUp })
  }

  onForgotPassword(emailId: string) {
    this.forgotPassPage = true
    this.emailIdLogIn = emailId;
    return this.baseService.post(this.forgotPassworsUrl, { "Email": emailId })
  }

  onResetpassword(password: string) {
    return this.baseService.post(this.onResetpasswordUrl, { "Email": this.emailIdLogIn, "password": password })
  }

  onLogin(email: string, password: string) {
    this.emailIdLogIn = email;
    return this.http
      .post(this.baseUrl + 'login', { "Email": email, "password": password }, { observe: 'response' })
      .pipe(
        retry(3)
      );
  }
  getCountry() {
    return this.http
      .get(this.baseUrlCountry + 'countries', { observe: 'response' })
      .pipe(
        retry(3)
      );
  }
  getSpeciality() {
    return this.http
      .get(this.baseUrl + 'speciality', { observe: 'response' })
      .pipe(
        retry(3)
      );
  }

  doLogout() {
    const countryCode = localStorage.getItem('countryCode');
    const country_id = localStorage.getItem("country_id");

    window.localStorage.removeItem('UserData');
    window.localStorage.removeItem('token');
    this.loggedInCustomerName = 'Login / Signup';
    this.loginFlag = false;
    this.showPrice = false;

    localStorage.clear();
    sessionStorage.clear();

    this.router.navigate([`/${countryCode}/login`]);
    localStorage.setItem("countryCode", countryCode);
    localStorage.setItem("country_id", country_id);
  }

}



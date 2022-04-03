import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { HandleErrorService } from './handle-error.service';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import data from '../../../assets/data.json';
import { AuthService } from './auth.service';
// CommonJS

@Injectable({
  providedIn: 'root'
})
export class CountryIsoService {
  phonecode: [
    { "value": "+1" },
    { "value": "+31" },
    { "value": "+44" },
    { "value": "+60" },
    { "value": "+61" },
    { "value": "+65" },
    { "value": "+91" }
  ]
  baseUrl: string;
  MessageTitile = {
    "aboutUs": "About Us",
    "contactus": "Contact Us",
    "termsofuse": "Terms of Use",
    "privacy": "Privacy Policy",
    "signup": " Lumiere32 Malaysia | Sign In and Registration",
    "pay32": "My Pay32 Wallet",
    "addmoney": "Top Up Pay32 Wallet",
    "cart": " My Shopping Cart",
    "checkout": " Checkout",
    "landingPage": "Dental Equipment | Medical Instruments & Supplies Online - Lumiere32.my",
    "shopNowDental": "Buy Medical Products, Equipments, Instruments & Materials Online - Lumiere32.my",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "orders": "Orders",
    "wishlist": "Wishlist",
    "quotation": "Quotations",
    "notifications": "Notifications",
    "defaultTitle": "Lumiere32"
  }

  countryName;

  breadcrum;
  //allCountries = [{"id":44,"itemName":"Australia","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"au","tax":[],"deliveryCharge":[]},{"id":43,"itemName":"Netherlands Antilles","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"kl","tax":[],"deliveryCharge":[]},{"id":41,"itemName":"United Kingdom","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"1234","tax":[],"deliveryCharge":[{"id":82,"title":"2 days delivery","noOfdays":"2","minimumOrderAmount":"20.00","deliveryCharge":"10.00","countryId":41,"currency":"Rupiah - IDR","adminStatus":1,"isDelete":0,"created_at":"2021-02-01T02:01:01.528Z","updated_at":"2021-02-01T02:01:01.528Z","instructions":null,"currencyId":2}]},{"id":40,"itemName":"Tuvalu","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"tv","tax":[],"deliveryCharge":[]},{"id":39,"itemName":"India","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"in","tax":[],"deliveryCharge":[]},{"id":38,"itemName":"Singapore","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"sg","tax":[{"id":7,"taxCode":"gst","taxRate":"5.00","countryId":38},{"id":5,"taxCode":"GST1","taxRate":"7.00","countryId":38}],"deliveryCharge":[{"id":77,"title":"Standard Delivery","noOfdays":"5","minimumOrderAmount":"70.00","deliveryCharge":"3.50","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-10T09:08:01.732Z","updated_at":"2020-09-10T09:08:01.732Z","instructions":"Standard delivery free for orders more than $70","currencyId":1},{"id":79,"title":"Next Day","noOfdays":"1","minimumOrderAmount":"10.00","deliveryCharge":"10.00","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-17T19:04:01.243Z","updated_at":"2020-09-17T19:04:01.243Z","instructions":"item will be delivered next day ","currencyId":1},{"id":78,"title":"Same Day","noOfdays":"1","minimumOrderAmount":"0.00","deliveryCharge":"5.00","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-10T09:08:27.100Z","updated_at":"2020-09-10T09:08:27.100Z","instructions":"Get next day","currencyId":1}]},{"id":37,"itemName":"Yugoslavia","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"yu","tax":[],"deliveryCharge":[]},{"id":36,"itemName":"Zimbabwe","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"}],"alphaCode":"zw","tax":[],"deliveryCharge":[]},{"id":32,"itemName":"Zambia","languages":[{"id":1,"itemName":"Malay","languageType":"Regional"}],"alphaCode":"zm","tax":[],"deliveryCharge":[]},{"id":30,"itemName":"Uruguay","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"uy","tax":[],"deliveryCharge":[]},{"id":28,"itemName":"United States","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"us","tax":[],"deliveryCharge":[{"id":64,"title":"arihant","noOfdays":"2","minimumOrderAmount":"100.00","deliveryCharge":"50.00","countryId":28,"currency":"2","adminStatus":1,"isDelete":0,"created_at":"2020-07-31T08:02:06.471Z","updated_at":"2020-07-31T08:02:06.471Z","instructions":null,"currencyId":null},{"id":70,"title":"New Deilvery Charge","noOfdays":"30","minimumOrderAmount":"1000.00","deliveryCharge":"20000.00","countryId":28,"currency":"Singapore Dollar","adminStatus":1,"isDelete":0,"created_at":"2020-08-05T04:57:58.128Z","updated_at":"2020-08-05T04:57:58.128Z","instructions":"asd","currencyId":null},{"id":73,"title":"asd","noOfdays":"12","minimumOrderAmount":"1111.00","deliveryCharge":"123.00","countryId":28,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-08-06T11:38:23.489Z","updated_at":"2020-08-06T11:38:23.489Z","instructions":"asd","currencyId":null}]},{"id":26,"itemName":"Vietnam","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"vn","tax":[],"deliveryCharge":[]},{"id":1,"itemName":"Malaysia","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"my","tax":[{"id":3,"taxCode":"GST","taxRate":"6.00","countryId":1}],"deliveryCharge":[{"id":61,"title":"2","noOfdays":"2","minimumOrderAmount":"2.00","deliveryCharge":"2.00","countryId":1,"currency":"1","adminStatus":1,"isDelete":0,"created_at":"2020-07-31T07:43:14.308Z","updated_at":"2020-07-31T07:43:14.308Z","instructions":null,"currencyId":null},{"id":71,"title":"New Charge","noOfdays":"30","minimumOrderAmount":"200.00","deliveryCharge":"1000.00","countryId":1,"currency":"Singapore Dollar","adminStatus":1,"isDelete":0,"created_at":"2020-08-05T05:05:01.940Z","updated_at":"2020-08-05T05:05:01.940Z","instructions":"test","currencyId":null}]},{"id":24,"itemName":"Yemen","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"ye","tax":[],"deliveryCharge":[]}]
  //allCountries = [{"id":1,"itemName":"Malaysia","languages":[{"id":1,"itemName":"Malay","languageType":"Regional"},{"id":2,"itemName":"English","languageType":"Regional"}],"alphaCode":"my","tax":[{"id":1,"taxCode":"GST","taxRate":"6.00","countryId":1}],"deliveryCharge":[{"id":1,"title":"Standary Delivery","noOfdays":"1","minimumOrderAmount":"250.00","deliveryCharge":"9.50","countryId":1,"currency":"Malaysian Ringgit - MYR","instructions":null,"currencyId":1,"adminStatus":1,"isDelete":0,"created_at":"2021-03-09T22:55:19.000Z","updated_at":"2021-03-09T22:55:19.000Z"}],"countryCurrency":{"id":1,"currency":"Malaysian Ringgit","currencyCode":"MYR","symbol":"MYR"},"countries":{"id":1,"sortname":"MY","country":"Malaysia","phoneCode":"60","status":0,"pncodeLength":5}}]
  allCountries = data.allCountries;
  selectedCountry = [];
  title = "Lumiere32 Malaysia"
  Swal;
  zeroResults: boolean = false


  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService,
    private handleErrorservice: HandleErrorService,
    private authService: AuthService
  ) {
    this.Swal = require('sweetalert2')
    this.baseUrl = this.baseService.baseUrl;
  }

  getCountriesList() {
    return this.http
      .get(this.baseService.baseUrlCountry + 'country')
      .pipe(
        catchError(this.handleErrorservice.handleError)
      );
  }

  getSelectedCountryObject(value) {
    if (this.allCountries != null) {
      this.selectedCountry = this.allCountries.filter(
        country => country.alphaCode == value
      );
    }
    localStorage.setItem('country_id', this.selectedCountry[0]?.id);
  }
  getCountryId() {
    return localStorage.getItem("country_id");
  }

  getCountryCode() {
    if (this.authService.loginFlag)
      return localStorage.getItem("countryCode");
    else {
      let countryCode = data.allCountries[0].alphaCode;
      return countryCode;
    }
  }

  getKey() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    return userDetail['Email'] + userDetail['firstName'];
  }

  getCountryTax() {
    let code = localStorage.getItem("countryCode");
    let country = JSON.parse(localStorage.getItem('country'));
    country = country.filter((o => o.alphaCode == code));
    console.log("country data from service", country[0].tax[0].taxRate);
    return country[0].tax[0].taxRate;
  }

  getLoggedInCustomerId() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    return userDetail['customerId'] || 0;
  }

  getCustomerNumberVerifiedOrNot() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    return userDetail['shippingMobileVerify']
  }

  getCustomerNumber() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    return userDetail['mobileNumber']
  }

  getShippingMobileNo() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    return userDetail['shippingMobileNo'];
  }

  setShippingMobileNo(number) {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    userDetail['shippingMobileNo'] = number;
    localStorage.setItem('UserData', JSON.stringify(userDetail))
  }

  setMobileVerfiedValueInStorage() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    userDetail['shippingMobileVerify'] = 1;
    localStorage.setItem('UserData', JSON.stringify(userDetail))
    return "Number Verified"
  }

  openSweetAlert(title, message) {
    Swal.fire({
      title: title,
      text: message,
      // showCancelButton: true,
      confirmButtonColor: '#63c7db',
      // cancelButtonColor:'#ff0000',
      confirmButtonText: '<div style="padding:5px 20px">Ok</div>',
    });
  }

  convertToSlug(Text) {
    return Text?.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      ;
  }

  registerSeller(data) {
    return this.http.post(this.baseService.baseUrlCountry + 'sellerRegister', data)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
}

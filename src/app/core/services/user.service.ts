import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HandleErrorService } from './handle-error.service';
import { CountryIsoService } from './country-iso.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  curr: any = 'RM';
  loggedInCustomer: string;
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private baseService: BaseService,
    private handleErrorservice: HandleErrorService,
    private countryIso: CountryIsoService
  ) {
    this.baseUrl = this.baseService.baseUrl;
  }

  getDashboardDetailsForMain(id) {
    // let url = `http://localhost:3000/api/v1/customer/${id}/dashboard`
    return this.http.get(this.baseService.baseUrl + id + `/dashboard`).pipe(
      // return this.http.get(url).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }
  getDetailsShopByBrand() {
    return this.http.get(this.baseService.baseUrlCountry + 'manufacturer').pipe(
      //return this.http.get(url).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }

  getFeaturedBrand() {
    const countryId = localStorage.getItem("country_id");
    if (countryId) {
      const featuredUrl = `${this.baseService.baseUrlCountry}manufacturerList?countryId=${countryId}&isFeatured=true`
      return this.http.get(featuredUrl).pipe(
        catchError(this.handleErrorservice.handleError)
      );
    }
  }
  getAllBrands() {
    const countryId = localStorage.getItem("country_id");
    if (countryId) {
      const url = this.baseService.baseUrlCountry + 'brandsList?countryId=' + countryId
      return this.http.get(url).pipe(
        catchError(this.handleErrorservice.handleError))
    }
  }

  getDentalBanner() {
    return this.http
      .get(this.baseService.baseUrlCountry + 'getdashboardProductByParentCategory')
      .pipe(
        catchError(this.handleErrorservice.handleError)
      );
  }
  getDashboardDetails(id, typeByUser) {
    let url = `http://localhost:3000/api/v1/customer/${id}/?type=${typeByUser}`;
    return this.http
      .get(
        this.baseService.baseUrl +
        this.countryIso.getLoggedInCustomerId() +
        `/?type=${typeByUser}`
      )
      .pipe(
        //return this.http.get(url).pipe(
        catchError(this.handleErrorservice.handleError)
      );
  }

  getChartData(ids, type, startDate, endDate, dateType) {
    // let url = `http://localhost:3000/api/v1/customer/walletDateWiseData/${id}?type=${type}&start_date=${endDate}&end_date=${startDate}&dateType=${dateType}`
    console.log('url', ids);
    // return this.http.get(this.baseService.baseUrl  + `walletDateWiseData/${id}?type=${type}&start_date=${endDate}&end_date=${startDate}&dateType=${dateType}` ).pipe(
    return this.http
      .get(
        this.baseService.baseUrl +
        `walletDateWiseData/` +
        this.countryIso.getLoggedInCustomerId() +
        `?type=${type}&start_date=${endDate}&end_date=${startDate}&dateType=${dateType}`
      )
      .pipe(
        //return this.http.get(url).pipe(
        catchError(this.handleErrorservice.handleError)
      );
  }

  getAllTopUpDetails() {
    return this.http
      .get(
        this.baseService.baseUrlRaw +
        `admin/topupScheme?countryId=${this.countryIso.getCountryId()}&status=1`
      )
      .pipe(catchError(this.handleErrorservice.handleError));
  }

  getProfilePersonalInfo() {
    return this.http
      .get(this.baseUrl + 'detail/' + this.countryIso.getLoggedInCustomerId(), {
        observe: 'response',
      })
      .pipe(catchError(this.handleErrorservice.handleError));
  }

  getBillingProfilePersonalInfo() {
    return this.http
      .get(this.baseUrl + 'detail/' + this.countryIso.getLoggedInCustomerId())
      .pipe(catchError(this.handleErrorservice.handleError));
  }

  postProfilePersonalInfo(data) {
    return this.http
      .put(this.baseUrl + 'update', data, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }

  /* this function will fetch active banner details */
  getBannerImageAndDetails(id) {
    return this.http
      .get(this.baseService.baseUrlAdmin + `bannerList?countryId=${id}`)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  getProfileAddressDetails(id) {
    return this.http
      .get(this.baseUrl + `address?customerId=${id}`, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  onAddressAdd(data) {
    return this.http
      .post(this.baseUrl + 'address', data, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  onUpdateAdd(data) {
    return this.http
      .post(this.baseUrl + 'address/', data, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  onUpdateAddDefault(data, id) {
    return this.http
      .put(this.baseUrl + 'address/' + id, data[0], { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  getProfileAddressAdd(id) {
    return this.http
      .get(this.baseUrl + `address/?customerId=${id}`, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  onDeleteAddress(id: number) {
    // .delete(this.baseUrl + 'address/' + id,{ observe: 'response' })
    // /customer/address/delete/:id
    return this.http
      .delete(this.baseUrl + 'address/delete/' + id, { observe: 'response' })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  onPasswordChange(data) {
    return this.baseService.post('changePassword', data);
  }
}

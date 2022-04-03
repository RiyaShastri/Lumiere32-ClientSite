import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CountryIsoService } from './country-iso.service';
import { Router } from '@angular/router';
import { HandleErrorService } from './handle-error.service';
import { retry, catchError, switchMap, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  getCategoriesFilters(categoryId: any, productType: any) {
    throw new Error('Method not implemented.');
  }
  paginationNumber$ = new BehaviorSubject(1);
  baseUrl: string;
  countryCode: any;
  isSearchProductHit: boolean;
  isSubCategory: boolean;
  productList$ = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService,
    private countryIsoService: CountryIsoService,
    private handleErrorservice: HandleErrorService
  ) {
    this.baseUrl = this.baseService.baseUrlCountry;
    this.countryCode = this.router.url.split('/')[1];
  }
  getProductCount(customerId) {
    return this.http
      .get(this.baseService.baseUrl + 'cartCount?customerId=' + customerId)
      .pipe(catchError(this.handleErrorservice.handleError));
  }

  productByCategoryFilterRequest$ = new BehaviorSubject(null);
  productByCategoryFilter$ = this.productByCategoryFilterRequest$.pipe(
    switchMap((req) => {
      return req ? this.getFilters(req.params, req.productType) : of(null);
    })
  );

  getFilters(data, type) {
    if (this.router.url.includes('isQuantityDiscount')) {
      data.isQuantityDiscount = true
      if (!data.categoryId)
        delete data.categoryId
    }
    data.languageId = 3;
    // data.countryId = this.countryIsoService.selectedCountry[0].id;
    data.countryId = localStorage.getItem("country_id");
    var qs = Object.keys(data)
      .map(function (key) {
        return key + '=' + data[key];
      })
      .join('&');
    if (type && type[0] == 'sc') {
      console.log('if');
      console.log('sdsdsds', type);
      return this.http
        .get(this.baseUrl + 'getAvailableProductFilter?' + qs)
        .pipe(catchError(this.handleErrorservice.handleError));
    } else {
      return this.http
        .get(this.baseUrl + 'getAvailableProductFilter?' + qs)
        .pipe(catchError(this.handleErrorservice.handleError));
    }
  }

  productByCategoryRequest$ = new BehaviorSubject(null);
  category$ = this.productByCategoryRequest$.pipe(
    switchMap((req) => {
      return req
        ? this.getProductsByCategory(req, req.page).pipe(
          catchError((e) =>
            of({
              data: {
                total: 0,
                results: [],
              },
            })
          )
        )
        : of(null);
    }),
    shareReplay(1)
  );

  isReset = new BehaviorSubject(false);
  getProductsByCategory(data, page) {
    if (this.isReset.value) {
      this.isReset.next(false);
      data.page = 0;
    }
    console.log('data from service', data);
    data.languageId = 3;
    // data.countryId = this.countryIsoService.selectedCountry[0].id;
    data.countryId = localStorage.getItem("country_id");
    data.page = data?.page;
    console.log('data..', data);
    if (data.sortPrice == null) {
      delete data.sortPrice
    }
    var qs = Object.keys(data)
      .map(function (key) {
        return key + '=' + data[key];
      })
      .join('&');
    console.log('qs ?', qs);

    return this.http
      .get(this.baseUrl + 'getProductbycategory?' + qs)
      .pipe(shareReplay(1), catchError(this.handleErrorservice.handleError));
  }

  getProductDetailId(id) {
    return this.http
      .get(this.baseUrl + 'getProductDetailById/' + id)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  deleteRow(id) {
    console.log(id);
    return this.http
      .post(this.baseService.baseUrl + 'delCart', { id: id })
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  askMoreRequest(data) {
    data.countryId = this.countryIsoService.getCountryId();
    return this.http
      .post(this.baseService.baseUrl + 'userRequest', data)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  /* get quotes */
  // submitQuotes(){
  //   return this.http
  //   .post(this.baseService.baseUrl + 'userRequest', data)
  //   .pipe(
  //     retry(3)
  //   );
  // }

  addToCart(data) {
    return this.http
      .post(this.baseService.baseUrl + 'cart', data)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
  getCartDetailID(id) {
    return this.http
      .get(this.baseService.baseUrl + 'cart?customerId=' + id)
      .pipe(catchError(this.handleErrorservice.handleError));
  }
}

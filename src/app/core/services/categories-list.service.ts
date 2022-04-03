import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CountryIsoService } from './country-iso.service';
import { Router } from '@angular/router';
import { HandleErrorService } from './handle-error.service';
import { retry, catchError, switchMap, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoriesListService {
  baseUrl: string;
  countryCode: string;
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

  getCategoryFilters(id, type) {
    if (type[0] == 'sc') {
      return this.http
        .get(
          this.baseUrl +
            'getAvailableProductFilterbyProductIds?countryId=' +
            this.countryIsoService.selectedCountry[0].id +
            '&languageId=3&categoryId=' +
            id
        )
        .pipe(catchError(this.handleErrorservice.handleError));
    } else {
      console.log('else');
      return this.http
        .get(
          this.baseUrl +
            'getAvailableProductFilterbyProductIds?countryId=' +
            this.countryIsoService.selectedCountry[0].id +
            '&languageId=3&parentCategoryId=' +
            id
        )
        .pipe(catchError(this.handleErrorservice.handleError));
    }
  }

  private algoliaSearchCategoryRequest$ =
    new BehaviorSubject<AlgoliaSearchRequest>(new AlgoliaSearchRequest());
  private algoliaSearchCategoryRequestFilter$ = new ReplaySubject<any>(1);

  getLatestIds() {
    // return this.algoliaSearchCategoryRequest$.value.productIds
  }

  updateAlgoliaRequest(algoliaSearchRequest: AlgoliaSearchRequest) {
    
    this.algoliaSearchCategoryRequest$.next(algoliaSearchRequest);
  }

  updateAlgoliaRequestFilter(req: any) {
    this.algoliaSearchCategoryRequestFilter$.next(req);
  }

  algoliaCategoryResponse$ = this.algoliaSearchCategoryRequest$.pipe(
    switchMap((request) =>
      request ? this.getAlgoliaCategory(request).pipe(shareReplay(1)) : of(null)
    ),
    shareReplay(1)
  );

  algoliaCategoryFilterResponse$ =
    this.algoliaSearchCategoryRequestFilter$.pipe(
      switchMap((request) =>
        this.getAlgoliaCategoryFilter(request).pipe(shareReplay(1))
      )
    );

  getAlgoliaCategory(request: AlgoliaSearchRequest) {
    request.countryId = this.countryIsoService.selectedCountry[0].id;
    
    return this.http
      .post(this.baseUrl + 'getProductbyProductIds', request)
      .pipe(shareReplay(1), catchError(this.handleErrorservice.handleError));
  }

  getAlgoliaCategoryFilter(request: any) {
    request.countryId = this.countryIsoService.selectedCountry[0].id;
    return this.http
      .post(this.baseUrl + 'getAvailableProductFilterbyProductIds?', request)
      .pipe(shareReplay(1), catchError(this.handleErrorservice.handleError));
  }
}

export class AlgoliaSearchRequest {
  query = '';
  page = 0;
  languageId = 3;
  countryId: any;
}

export class CategorySearchRequest {
  page = 0;
  languageId = 3;
  countryId: any;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { HandleErrorService } from './handle-error.service';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConcentratorsService {

  baseUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService,
    private handleErrorservice: HandleErrorService
  ) {
    this.baseUrl = this.baseService.baseUrl;
  }


  checkoutStripe(body) {
    let url = "http://lumiere32.my/testapi/v1/create-checkout-session{productIndex}"
    return this.http.post(this.baseService.baseUrlRaw + 'create-checkout-session/oxygen', body).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }

  checkoutQuote(body) {
    // let url = "http://lumiere32.my/testapi/v1/create-oxygen-request-for-quote"
    return this.http.post(this.baseService.baseUrlRaw + 'create-oxygen-request-for-quote', body).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }

  getMicrositeProducts() {
    return this.http.get(this.baseService.baseUrlAdmin + 'oxygenMicrosite')
      .pipe(
        catchError(this.handleErrorservice.handleError)
      );
  }
}

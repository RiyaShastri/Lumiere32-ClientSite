import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BaseService } from './base.service';
import { retry, catchError } from 'rxjs/operators';
import {HandleErrorService} from './handle-error.service';
@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient, private baseService: BaseService,private handleErrorservice : HandleErrorService) { }

  getOrderDetailsById(condition,customerid){
   // let url = `http://localhost:3000/api/v1/customer/order-per-customer?condition=${condition}&customerid=${customerid}`
   // return this.http.get(url)
    return this.http.get(this.baseService.baseUrlRaw + `customer/order-per-customer?condition=${condition}&customerid=${customerid}`)
    .pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  getSingleOrderDetailsById(id){
    return this.http.get(this.baseService.baseUrlAdmin + `quotation/`+id)
    .pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  downloadPDFFromService(id){

     return this.http.get(this.baseService.baseUrlAdmin + `quotationPdf/`+btoa(id))
    .pipe(
      catchError(this.handleErrorservice.handleError)
    )

  }
}

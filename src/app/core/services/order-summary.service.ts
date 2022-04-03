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
export class OrderSummaryService {

  constructor(private http: HttpClient, private baseService: BaseService,
    private handleErrorservice : HandleErrorService
    ) { }

  getOrderDetailsByCustomer(id,limit){
  //  let url = "http://localhost:3000/api/v1/customer/get-order-details/customer/"
   // return this.http.get(url + id +`?page=1&limit=${limit}`)
    return this.http.get(this.baseService.baseUrl + 'get-order-details/customer/' + id +`?page=1&limit=${limit}`)
    .pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  ///admin/order/:id
  // /admin/get-order-details/customer/:id
  getOrderDetailsById(id){
    let url = "http://localhost:3000/api/v1/admin/get-order-details/customer/"
    //return this.http.get(url + id )
    return this.http.get(this.baseService.baseUrlAdmin + 'get-order-details/customer/' + id)
    .pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }


  getSingleProductStatus(){
    let url = "http://localhost:3000/api/v1/admin/order-product/status"
   // return this.http.get(url).pipe(
    return this.http.get(this.baseService.baseUrlAdmin + 'order-product/status').pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  getOrderStatus(){


    return this.http.get(this.baseService.baseUrlRaw + 'order-status').pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  filterOrderForCustomer(id,qry){
    //let url = `http://localhost:3000/api/v1/admin/filter-order-data/customer/?customerId=${id}${qry}`
    //console.log("url is",url)
    //return this.http.get(url).pipe(
      return this.http.get(this.baseService.baseUrlAdmin + `filter-order-data/customer/?customerId=${id}${qry}`).pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  updateOrder(body,id){
    let url = "http://localhost:3000/api/v1/admin/orders/update-order-products-status/"
    // return this.http.post(this.baseService.baseUrlAdmin + 'orders/update-order-products-status/' + id ,body).pipe(
    //  return this.http.post(url + id ,body).pipe(
      return this.http.put(this.baseService.baseUrl + 'order-cancel/' + id ,body).pipe(
      catchError(this.handleErrorservice.handleError)
    )
  }

  cancelOrder(id,body){
    let url = "http://localhost:3000/api/v1/admin/cancelorder/"+id
      return this.http.put(this.baseService.baseUrl + 'order-cancel/' + id ,body).pipe(
      //return this.http.post(url ,body).pipe(
      catchError(this.handleErrorservice.handleError)
    )

  }

  downloadInvoice(id){
    var encodedId= btoa(id)
    var navLink = `${this.baseService.baseUrlRaw}orderPdf/` + encodedId

    window.open(navLink, '_blank');
    return

  }

}

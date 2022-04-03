import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import {HandleErrorService} from './handle-error.service';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private http: HttpClient,
    private baseService: BaseService,
    private handleErrorservice : HandleErrorService
  ) { }

  postEnquiry(body){
    return this.http.post(this.baseService.baseUrlAdmin + 'contactUs' ,body).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }

  sendTokenToBackend(token){
    let url ="http://localhost:3000"
    //return this.http.post(url + '/token_validate' ,{recaptcha: token}).pipe(
      return this.http.post(this.baseService.dns + '/token_validate' ,{recaptcha: token}).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }
}

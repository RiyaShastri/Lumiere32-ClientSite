import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HandleErrorService } from './handle-error.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService,
    private handleErrorservice: HandleErrorService
  ) { }

  subscribeNewsLetter(countryid,email) {
    return this.http.get(this.baseService.baseUrlRaw + `newsletter?countryId=${countryid}&email=${email}` ).pipe(
      catchError(this.handleErrorservice.handleError)
    );
  }
}

import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse,HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`
      );
      errorMessage = error.error.message || error.message;
    }
    return throwError(error);
  }
}

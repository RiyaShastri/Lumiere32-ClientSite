import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = localStorage.getItem(
      'eM+yEiZhbf6/ohrhPqgAVGSCf6owVU4GauASpetaTZ8='
    );

    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });
    }

    if (
      request.headers.has('Content-Type')
    ) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
      request = request.clone({
        headers: request.headers.set('charset', 'UTF-8'),
      });

      request = request.clone({
        headers: request.headers.set('Access-Control-Allow-Origin', '*'),
      });
    }


    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //  this.loading.dismiss();
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason:
            error && error.error && error.error.reason
              ? error.error.reason
              : '',
          status: error.status,
        };

        return throwError(error);
      })
    );
  }
}


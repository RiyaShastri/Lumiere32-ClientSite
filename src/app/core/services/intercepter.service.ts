import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { EncrDecrServiceService } from './encr-decr-service.service';

@Injectable({
  providedIn: 'root',
})
export class BackendInterceptor implements HttpInterceptor {
  public dataEncrypted: string;
  constructor(private EncrDecr: EncrDecrServiceService) {
    this.EncrDecr.myMethod$.subscribe((data) => {
      data;
      this.dataEncrypted = data; // And he have data here too!
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available

    //   var conversionOutput = CryptoJS.AES.decrypt(localStorage.getItem('token'), 'secret key 123').toString(CryptoJS.enc.Utf8);
    //   var text = CryptoJS.AES.encrypt('hi there how are you', 'secret key 123').toString();
    //  var decryptText  = CryptoJS.AES.decrypt(text, 'secret key 123');
    //   var originalText = decryptText.toString(CryptoJS.enc.Utf8);
    console.log('enterceptor', localStorage.getItem('token'));
    var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', this.dataEncrypted);

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          // 'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + token,
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          // 'Access-Control-Allow-Origin': '*'
        },
      });
    }

    return next.handle(request);
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');

    if(!token) {
      return next.handle(request);
    }

    if (!request.url.startsWith('/')) {
      return next.handle(request);
    }

    const fullUrl = environment.baseUrl + request.url;
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
      url: fullUrl
    });

    return next.handle(newRequest);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url && req.url[0] === '/' && API_URL) {
      const _req = req.clone({
        url: API_URL + req.url,
      });
      return next.handle(_req);
    }

    return next.handle(req);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url && req.url[0] === '/' && environment.api_host) {
      const _req = req.clone({
        url:
          '//' +
          environment.api_host +
          (environment.api_port ? ':' + environment.api_port : '') +
          req.url,
      });
      return next.handle(_req);
    }

    return next.handle(req);
  }
}

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { RollbarService } from '../services';

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import { MessageService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Interceptor
// -------------------------------------------------------------------------- //
@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private messageService: MessageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        const rollbar = this.injector.get(RollbarService);
        let errorMessage = '';
        let errorSummary = '';
        let errorDetail = '';
        let tmpError = '';

        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorDetail = `Error: ${error.error.message}`;
          errorSummary = 'Error';
        } else {
          // server-side error
          errorSummary = `Error Code: ${error.status}`;
          tmpError = `Message: ${error.message}`;
          const tmpSlashArray = tmpError.split('/');
          if (tmpSlashArray.length > 0) {
            // Get the last part of the error message string,
            // it should start with the gene searched id
            const tmpString = tmpSlashArray[tmpSlashArray.length - 1];
            const tmpSpaceArray: string[] = tmpString.split(' ');
            const finalString = tmpSpaceArray[0].slice(0, -1);
            if (tmpSpaceArray.length > 0) {
              tmpError = `Message: Gene ${finalString} not found!`;
            }
          }
          errorDetail = tmpError;
        }
        errorMessage = errorMessage + '\n' + errorSummary;

        // Displays error message on screen
        this.messageService.clear();
        this.messageService.add({
          severity: 'warn',
          sticky: true,
          summary: errorSummary,
          detail: errorDetail,
          life: 3000,
        });
        const self = this;
        setTimeout(() => {
          self.messageService.clear();
        }, 3000);

        // Send the error message to Rollbar
        rollbar.error(error);

        return throwError({ errorSummary, errorMessage });
      })
    );
  }
}

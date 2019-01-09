import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { RollbarService } from '../../shared/shared.module';

import { MessageService } from 'primeng/components/common/messageservice';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private messageService: MessageService
    ) {
        //
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const self = this;
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    const rollbar = this.injector.get(RollbarService);
                    let errorMessage = '';
                    let errorSummary = '';
                    let errorDetail = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorDetail = `Error: ${error.error.message}`;
                        errorSummary = 'Error';
                    } else {
                        // server-side error
                        errorSummary = `Error Code: ${error.status}`;
                        errorDetail = `Message: ${error.message}`;
                    }
                    errorMessage = errorMessage + '\n' + errorSummary;

                    self.messageService.clear();
                    self.messageService.add({
                        severity: 'error',
                        sticky: true,
                        summary: errorSummary,
                        detail: errorDetail,
                        life: 3000
                    });

                    rollbar.error(error);
                    return throwError({ errorSummary, errorMessage });
                })
            );
    }
}

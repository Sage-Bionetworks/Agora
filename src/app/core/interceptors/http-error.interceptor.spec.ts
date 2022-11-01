// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { HttpErrorInterceptor } from '.';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Interceptor: API', () => {
  let httpErrorInterceptor: HttpErrorInterceptor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        //HttpClient,
        Injector,
        MessageService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpErrorInterceptor).toBeTruthy();
  });

  // it('should intercept http error', fakeAsync(() => {
  //   const iSpy = spyOn(httpErrorInterceptor, 'intercept');
  //   const msSpy = spyOn(messageService, 'clear');

  //   const errorResponse = new HttpErrorResponse({
  //     error: '404 error',
  //     status: 404,
  //     statusText: 'Not Found',
  //   });

  //   httpClient.get('/api').subscribe();

  //   let req = httpMock.expectOne('/api');
  //   req.error(new ErrorEvent('404 Error first'), errorResponse);
  //   req = httpMock.expectOne('/api');
  //   req.error(new ErrorEvent('404 Error second'), errorResponse);

  //   expect(req.cancelled).toBeTruthy();
  // }));
});

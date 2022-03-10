import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterService } from 'primeng/api';

import {
    RouterStub,
    ActivatedRouteStub,
    ApiServiceStub,
    mockInfo1
} from '../../testing';

import { GeneComparisonToolComponent } from '.';

import { ApiService } from '../../core/services';

describe('Component: GeneComparisonToolComponent', () => {
   let component: GeneComparisonToolComponent;
   let fixture: ComponentFixture<GeneComparisonToolComponent>;
   let apiService: ApiServiceStub;
   let activatedRoute: any;

   beforeEach(async(() => {
       TestBed.configureTestingModule({
           declarations: [
               GeneComparisonToolComponent
           ],
           // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
           // elements and attributes
           schemas: [ NO_ERRORS_SCHEMA ],
           providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: FilterService, useValue: new FilterService() },
           ]
       })
       .compileComponents();

       fixture = TestBed.createComponent(GeneComparisonToolComponent);

       // Get the injected instances
       apiService = fixture.debugElement.injector.get(ApiService);
       activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
       activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

       component = fixture.componentInstance; // Component test instance
   }));

   it('should create', () => {
       expect(component).toBeTruthy();
   });

   it('should have 3 tables', () => {
       const el = fixture.debugElement.query(By.css('p-table'));
       expect(el).toBeDefined();

       const aEl = fixture.debugElement.queryAll(By.css('p-table'));
       expect(aEl.length).toEqual(3);
   });
});

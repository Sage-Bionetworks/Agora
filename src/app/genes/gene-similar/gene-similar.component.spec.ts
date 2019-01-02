import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    ForceServiceStub,
    GeneServiceStub,
    mockInfo1,
    NavigationServiceStub
} from '../../testing';

import { GeneSimilarComponent } from './gene-similar.component';

import { ApiService, NavigationService, ForceService, GeneService } from '../../core/services';

import { MockComponent } from 'ng-mocks';

import { ArraySortPipe } from '../../shared/pipes';

import { Table } from 'primeng/table';

describe('Component: GeneSimilar', () => {
    let component: GeneSimilarComponent;
    let fixture: ComponentFixture<GeneSimilarComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let navService: NavigationServiceStub;
    let forceService: ForceServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneSimilarComponent,
                MockComponent(Table),
                ArraySortPipe
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneSimilarComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        navService = fixture.debugElement.injector.get(NavigationService);
        forceService = fixture.debugElement.injector.get(ForceService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('p-table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-table'));
        expect(aEl.length).toEqual(1);
    });
});

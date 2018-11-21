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
    DataServiceStub,
    ForceServiceStub,
    GeneServiceStub,
    mockInfo1
} from '../../testing';

import { GeneBRComponent } from './gene-brainregions.component';

import { ApiService, DataService, ForceService, GeneService } from '../../core/services';

import { MockComponent } from 'ng-mocks';

import { ArraySortPipe } from '../../shared/pipes';

describe('Component: GeneBR', () => {
    let component: GeneBRComponent;
    let fixture: ComponentFixture<GeneBRComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let dataService: DataServiceStub;
    let forceService: ForceServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneBRComponent,
                MockComponent(GeneBRComponent),
                ArraySortPipe
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneBRComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        dataService = fixture.debugElement.injector.get(DataService);
        forceService = fixture.debugElement.injector.get(ForceService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('table'));
        expect(aEl.length).toEqual(1);
    });
});

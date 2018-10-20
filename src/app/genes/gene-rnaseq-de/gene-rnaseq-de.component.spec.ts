import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    DataServiceStub,
    ChartServiceStub,
    GeneServiceStub,
    mockInfo1
} from '../../../testing';

import { GeneRNASeqDEComponent } from './gene-rnaseq-de.component';

import { ApiService, DataService, GeneService } from '../../../core/services';
import { ChartService } from '../../../charts/services';

import { MockComponent } from 'ng-mocks';

import { ArraySortPipe } from '../../../shared/pipes';

describe('Component: GeneNetwork', () => {
    let component: GeneRNASeqDEComponent;
    let fixture: ComponentFixture<GeneRNASeqDEComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let dataService: DataServiceStub;
    let chartService: ChartServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneRNASeqDEComponent,
                MockComponent(GeneRNASeqDEComponent),
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
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneRNASeqDEComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        dataService = fixture.debugElement.injector.get(DataService);
        chartService = fixture.debugElement.injector.get(ChartService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

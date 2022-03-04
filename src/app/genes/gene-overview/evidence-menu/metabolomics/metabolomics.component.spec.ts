import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    GeneServiceStub,
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    mockMetabolomics,
    mockInfo1,
    DataServiceStub
} from '../../../../testing';

import { MetabolomicsComponent } from './metabolomics.component';

import { ApiService, GeneService, DataService } from '../../../../core/services';

describe('Component: Metabolomics', () => {
    let component: MetabolomicsComponent;
    let fixture: ComponentFixture<MetabolomicsComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;
    let geneService: GeneServiceStub;
    let dataService: DataServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MetabolomicsComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(MetabolomicsComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.ensembl_gene_id });

        component = fixture.componentInstance; // Component test instance
        component.metabolomics = mockMetabolomics;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the significant figures of a number', () => {
        const gsfSpy = spyOn(component, 'getSignificantFigures').and.callThrough();
        const value: number = component.getSignificantFigures(0.023456, 2);

        expect(gsfSpy.calls.any()).toEqual(true);
        // Look in the dataService for the calculations
        expect(value).toEqual(0.011);
    });
});

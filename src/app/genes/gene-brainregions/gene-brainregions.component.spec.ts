import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    RouterStub,
    ForceServiceStub,
    ActivatedRouteStub,
    GeneServiceStub,
    mockInfo1
} from '../../testing';

import { GeneBRComponent } from './gene-brainregions.component';

import { ApiService, ForceService, GeneService } from '../../core/services';

describe('Component: GeneBR', () => {
    let component: GeneBRComponent;
    let fixture: ComponentFixture<GeneBRComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;
    let geneService: GeneServiceStub;
    let forceService: ForceServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneBRComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneBRComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        forceService = fixture.debugElement.injector.get(ForceService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });
        location = fixture.debugElement.injector.get(SpyLocation);

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

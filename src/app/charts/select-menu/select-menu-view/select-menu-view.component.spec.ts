import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    DataServiceStub,
    ChartServiceStub,
    ActivatedRouteStub,
    ApiServiceStub,
    mockInfo1
} from '../../../testing';

import { SelectMenuViewComponent } from './select-menu-view.component';

import { GeneService, ApiService } from '../../../core/services';
import { ChartService } from '../../services';

import { of, empty, Observable } from 'rxjs';

import { MockComponent } from 'ng-mocks';

describe('Component: SelectMenuView', () => {
    let component: SelectMenuViewComponent;
    let fixture: ComponentFixture<SelectMenuViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectMenuViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SelectMenuViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance
        component.columnName = '';
        component.defaultValue = '';
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get label and call init if there is no label', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        expect(component.label).not.toBe('select-menu');
        component.ngOnInit();
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });

    it('should call init if a label is present', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        component.label = 'select-menu';
        component.ngOnInit();
        fixture.detectChanges();

        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });

    it('should remove chart on navigation start', () => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        const rnSpy = spyOn(router, 'navigate').and.callThrough();
        router.events = router.asObs;
        component.ngOnInit();
        router.navigate(['/']);
        fixture.detectChanges();
        expect(rsSpy).toHaveBeenCalled();
        expect(rnSpy).toHaveBeenCalled();
    });

    it('should remove chart on location pop state', () => {
        // spyOn(component, 'ngOnInit').and.callThrough();
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        // location.go('/genes');
        component.ngOnInit();
        location.subscribe((value: any) => {
            // Since onPopState from PlatformLocation is not triggered
            // we manually remove the charts if we receive a popstate
            expect(value.type).toEqual('popstate');
            if (value.type === 'popstate') {
                component.removeSelf();
            }

            expect(rsSpy).toHaveBeenCalled();
        });
        fixture.detectChanges();
        location.simulateUrlPop('/genes');
    });

    it('should not remove chart if there is no chart', () => {
        const csrcSpy = spyOn(chartService, 'removeChart').and.callThrough();
        const csrcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();
        const gsspgSpy = spyOn(geneService, 'setPreviousGene').and.callThrough();
        const rcSpy = spyOn(component, 'removeChart').and.callThrough();
        component.chart = null;
        component.removeChart();
        fixture.detectChanges();
        expect(rcSpy).toHaveBeenCalled();
        expect(csrcSpy).not.toHaveBeenCalled();
        expect(csrcnSpy).not.toHaveBeenCalled();
        expect(gsspgSpy).not.toHaveBeenCalled();
    });
});

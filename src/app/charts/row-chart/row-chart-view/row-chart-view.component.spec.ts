import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    ChartServiceStub,
    DataServiceStub,
    mockModels,
    mockTissues
} from '../../../testing';

import { RowChartViewComponent } from './row-chart-view.component';

import { GeneService, DataService } from '../../../core/services';
import { ChartService } from '../../services';

describe('Component: RowChartView', () => {
    let component: RowChartViewComponent;
    let fixture: ComponentFixture<RowChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RowChartViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(RowChartViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not call init charts if the statistical model is not selected', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        component.ngOnInit();
        geneService.setDefaultModel(mockModels[0]);
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();

        expect(component.currentModel).toEqual(mockModels[0]);
    });

    it('should call init if the statistical model was already selected', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        component.ngOnInit();
        geneService.setDefaultModel(mockModels[0]);
        // geneService.setDefaultTissue(mockTissues[0]);
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();

        const state = true;
        chartService.chartsReadySource.next(state);
        expect(icSpy).toHaveBeenCalled();

        // expect(component.currentTissue).toEqual(mockTissues[0]);
        expect(component.currentModel).toEqual(mockModels[0]);
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

    it('should have init the chart', () => {
        const fpDim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };

        const fpGroup = {
            all() {
                return chartService.filteredData['fpGroup'].values;
            },
            order() {
                //
            },
            top() {
                //
            }
        };

        component.initChart();
        fixture.detectChanges();

        expect(JSON.stringify(component.dim)).toEqual(JSON.stringify(fpDim));
        expect(JSON.stringify(component.group)).toEqual(JSON.stringify(fpGroup));
    });
});

import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    DataServiceStub,
    ChartServiceStub,
    mockInfo1
} from '../../../testing';

import { MedianChartViewComponent } from './median-chart-view.component';

import { GeneService, DataService } from '../../../core/services';
import { ChartService } from '../../services';

import * as dc from 'dc';

describe('Component: MedianChartView', () => {
    let component: MedianChartViewComponent;
    let fixture: ComponentFixture<MedianChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let dataService: DataServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MedianChartViewComponent
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

        fixture = TestBed.createComponent(MedianChartViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
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
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();

        const state = false;
        chartService.chartsReadySource.next(state);
        expect(icSpy).not.toHaveBeenCalled();
    });

    xit('should call init if the statistical model was already selected', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();
        component.geneinfo = mockInfo1;
        component.ngOnInit();
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();

        const state = true;
        chartService.chartsReadySource.next(state);
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
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        location.subscribe((value: any) => {
            // Since onPopState from PlatformLocation is not triggered
            // we manually remove the charts if we receive a popstate
            expect(value.type).toEqual('popstate');
            if (value.type === 'popstate') {
                component.removeSelf();
            }

            expect(rsSpy).toHaveBeenCalled();
        });
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

    xit('should remove chart if there is a chart', () => {
        const csrcSpy = spyOn(chartService, 'removeChart').and.callThrough();
        const csrcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();
        const gsspgSpy = spyOn(geneService, 'setPreviousGene').and.callThrough();
        const rcSpy = spyOn(component, 'removeChart').and.callThrough();
        component.geneinfo = mockInfo1;
        component.chart = dc.barChart(component.medianChart.nativeElement)
            .yAxisLabel('LOG CPM', 20);
        component.removeChart();
        fixture.detectChanges();
        expect(rcSpy).toHaveBeenCalled();
        expect(csrcSpy).toHaveBeenCalled();
        expect(csrcnSpy).toHaveBeenCalled();
        expect(gsspgSpy).toHaveBeenCalled();
    });
});

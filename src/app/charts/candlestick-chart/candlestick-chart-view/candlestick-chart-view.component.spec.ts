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
    ChartServiceStub
} from '../../../testing';

import { CandlestickChartViewComponent } from './candlestick-chart-view.component';
import { GeneService, DataService } from '../../../core/services';
import { ChartService } from '../../services';
import { By } from '@angular/platform-browser';

describe('Component: CandlestickChartViewComponent', () => {

    let component: CandlestickChartViewComponent;
    let fixture: ComponentFixture<CandlestickChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let dataService: DataServiceStub;
    let chartService: ChartServiceStub;
    let location: SpyLocation;
    const rawData = [{
        id: 'abc1',
        ensembl_gene_id: 'abc',
        oddsratio: 0.1,
        ci_lower: 0.2,
        ci_upper: 0.4,
        pval: 0.001,
        pval_adj: 0.02,
        neuropath_type: 'AAA'
    }];
    const chartData = [{
        key: 'AAA',
        ensembl_gene_id: 'abc',
        value: {
            min: 0.2,
            max: 0.4,
            mean: 0.1,
            pval_adj: 0.02
        }
    }];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CandlestickChartViewComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CandlestickChartViewComponent);
        router = fixture.debugElement.injector.get(Router);  // Testbed.inject
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        chartService = fixture.debugElement.injector.get(ChartService);
        location = fixture.debugElement.injector.get(SpyLocation);
        component = fixture.componentInstance;

    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should have the correct dataset from server after on init', () => {
        const spy = spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();

        const data = component.getRawData();
        expect(data).toEqual(rawData);
    });

    it('should have formatted data and call chart init after view init call', () => {
        const fSpy = spyOn(component, 'formatData').and.callThrough();
        const iSpy = spyOn(component, 'initChart').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();
        component.ngAfterViewInit();
        expect(fSpy).toHaveBeenCalled();
        expect(iSpy).toHaveBeenCalled();

        const data = component.getChartData();
        expect(data[0]).toEqual(chartData[0]);
    });

    it('should create chart after chart init call', (done) => {
        const spy = spyOn(component, 'renderChart').and.callThrough();
        const elClass = `.${component.getLabel()}-svg`;

        component.ngOnInit();
        fixture.detectChanges();
        component.formatData();
        component.getChartPromise().then(() => {
            fixture.detectChanges();
            expect(spy).toHaveBeenCalled();
            const el = fixture.debugElement.query(By.css(elClass));
            expect(el).toBeDefined();
            done();
        });
    });

    it('should create mid circle tooltip container', () => {
        const elClass = `.${component.getLabel()}-tooltip`;
        const tooltip = component.createTooltip(elClass);
        const el = fixture.debugElement.query(By.css(elClass));
        expect(el).toBeDefined();
    });

    it('should create x-axis tooltip container', () => {
        const elClass = `.${component.getLabel()}-axis-tooltip`;
        const tooltip = component.createTooltip(elClass);
        const el = fixture.debugElement.query(By.css(elClass));
        expect(el).toBeDefined();
    });

});

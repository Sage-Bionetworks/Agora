import {
    TestBed
} from '@angular/core/testing';

import {
    ApiServiceStub,
    ForceServiceStub,
    mockGene1,
    mockGenesResponse,
    mockLinksListResponse,
    mockTissues,
    mockModels
} from '../../testing';

import { ChartService } from './';

import * as d3 from 'd3';
import * as dc from 'dc';

describe('Service: Chart: TestBed', () => {
    let chartService: ChartService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ChartService
            ]
        });

        chartService = TestBed.get(ChartService);
    });

    it('should create an instance', () => {
        expect(chartService).toBeDefined();
    });

    it('should not add a chart info without a label', () => {
        const aciSpy = spyOn(chartService, 'addChartInfo').and.callThrough();

        chartService.addChartInfo('', {});
        expect(aciSpy).toHaveBeenCalled();
        expect(chartService.chartInfos.size).toEqual(0);
    });

    it('should add the charts info', () => {
        const aciSpy = spyOn(chartService, 'addChartInfo').and.callThrough();

        chartService.addChartInfo('select-model', {});
        expect(aciSpy).toHaveBeenCalled();
        expect(chartService.chartInfos.size).toEqual(1);
    });

    it('should not add a chart name without a name string', () => {
        const acnSpy = spyOn(chartService, 'addChartName').and.callThrough();

        chartService.addChartName('');
        expect(acnSpy).toHaveBeenCalled();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            expect(value).toEqual(false);
        });
    });

    it('should add a chart name', () => {
        const acnSpy = spyOn(chartService, 'addChartName').and.callThrough();

        chartService.addChartName('median-chart');
        expect(acnSpy).toHaveBeenCalled();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            if (key === 'median-chart') {
                expect(value).toEqual(true);
            } else {
                expect(value).toEqual(false);
            }
        });
    });

    it('should notify charts ready when adding a chart name', () => {
        const acnSpy = spyOn(chartService, 'addChartName').and.callThrough();
        const acrSpy = spyOn(chartService, 'allChartsLoaded').and.callThrough();

        chartService.chartsReadySource.subscribe((state) => {
            expect(state).toEqual(true);
        });

        chartService.chartNames.forEach((value: boolean, key: string) => {
            chartService.chartNames.set(key, true);
        });

        chartService.addChartName('median-chart');
        expect(acnSpy).toHaveBeenCalled();
        expect(acrSpy).toHaveBeenCalled();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            expect(value).toEqual(true);
        });
    });

    it('should not remove a chart name without a name string', () => {
        const rcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            chartService.chartNames.set(key, true);
        });

        chartService.removeChartName('');
        expect(rcnSpy).toHaveBeenCalled();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            expect(value).toEqual(true);
        });
    });

    it('should remove a chart name', () => {
        const rcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            chartService.chartNames.set(key, true);
        });

        chartService.removeChartName('median-chart');
        expect(rcnSpy).toHaveBeenCalled();

        chartService.chartNames.forEach((value: boolean, key: string) => {
            if (key === 'median-chart') {
                expect(value).toEqual(false);
            } else {
                expect(value).toEqual(true);
            }
        });
    });

    it('should notify remove charts if there are none after removing a chart name', () => {
        const rcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();
        const aecSpy = spyOn(chartService, 'allEmptyCharts').and.callThrough();
        const rSpy = spyOn(dc.chartRegistry, 'clear').and.callThrough();

        chartService.chartsReadySource.subscribe((state) => {
            expect(state).toEqual(false);
        });

        chartService.chartNames.forEach((value: boolean, key: string) => {
            chartService.chartNames.set(key, false);
        });

        chartService.removeChartName('');

        expect(rcnSpy).toHaveBeenCalled();
        expect(aecSpy).toHaveBeenCalled();
        expect(rSpy).toHaveBeenCalled();
    });

    it('should get the chart info', () => {
        const gciSpy = spyOn(chartService, 'getChartInfo').and.callThrough();

        chartService.chartInfos.set('median-chart', {});

        const info = chartService.getChartInfo('median-chart');

        expect(gciSpy).toHaveBeenCalled();
        expect(info).toEqual({});
    });

    it('should remove a chart, and clear the groups and dimensions', () => {
        const dim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };
        const group = {
            all() {
                return [];
            },
            order() {
                //
            },
            top() {
                //
            }
        };
        // Could have been any chart here
        const chart = dc.barChart('body')
            .dimension(dim)
            .group(group);

        // Removes the default function or it will attempt to redraw
        chart.filterAll = () => {
            //
        };

        const gciSpy = spyOn(chartService, 'removeChart').and.callThrough();
        const drSpy = spyOn(dc.chartRegistry, 'deregister').and.callThrough();
        const cfaSpy = spyOn(chart, 'filterAll').and.callThrough();
        const dfaSpy = spyOn(dim, 'filterAll').and.callThrough();

        chartService.removeChart(chart, group, dim);

        expect(gciSpy).toHaveBeenCalled();
        expect(cfaSpy).toHaveBeenCalled();
        expect(dfaSpy).toHaveBeenCalled();
        expect(drSpy).toHaveBeenCalled();
    });

    it('should get all the correct tooltip texts', () => {
        const gttSpy = spyOn(chartService, 'getTooltipText').and.callThrough();

        expect(chartService.getTooltipText('CBE')).toEqual('Cerebellum');
        expect(chartService.getTooltipText('DLPFC')).toEqual('Dorsolateral Prefrontal Cortex');
        expect(chartService.getTooltipText('FP')).toEqual('Frontal Pole');
        expect(chartService.getTooltipText('IFG')).toEqual('Inferior Frontal Gyrus');
        expect(chartService.getTooltipText('PHG')).toEqual('Parahippocampal Gyrus');
        expect(chartService.getTooltipText('STG')).toEqual('Superior Temporal Gyrus');
        expect(chartService.getTooltipText('TCX')).toEqual('Temporal Cortex');
        expect(chartService.getTooltipText('Test')).toEqual('');

        expect(gttSpy).toHaveBeenCalled();
    });
});

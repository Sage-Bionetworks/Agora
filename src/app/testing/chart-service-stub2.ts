// A copy of chart-service-stub to support data field name refactoring.

import { Injectable } from '@angular/core';

import * as dc from 'dc';

import { Subject } from 'rxjs';

import { mockInfo1 } from './gene-mocks';

@Injectable()
export class ChartServiceStub2 {
    chartInfos: Map<string, any> = new Map<string, any>();
    chartNames: Map<string, boolean> = new Map([
        ['median-chart', false],
        ['box-plot', false],
        ['forest-plot', false],
        ['select-model', false]
    ]);
    chartRendered: Map<string, boolean> = new Map([
        ['median-chart', false],
        ['box-plot', false],
        ['forest-plot', false],
        ['select-model', false]
    ]);
    pChartInfos: Map<string, any> = new Map<string, any>();
    pChartNames: Map<string, boolean> = new Map([
        ['pbox-plot', false],
        ['select-protein', false]
    ]);
    queryFilter: any = {
        smGroup: null,
        bpGroup: null,
        fpGroup: null,
        mcGroup: null
    };
    pQueryFilter: any = {
        spGroup: null,
        bpGroup: null
    };
    filteredData: any = {
        smGroup: {
            values: [],
            top: {}
        },
        bpGroup: {
            values: [],
            top: {}
        },
        fpGroup: {
            values: [],
            top: {}
        },
        mcGroup: {
            values: [],
            top: {}
        },
        spGroup: {
            values: [],
            top: {}
        },
        cpGroup: [{
            id: 'abc1',
            ensg: 'ENSG001',
            oddsratio: 0.1,
            ci_lower: 0.2,
            ci_upper: 0.4,
            pval: 0.001,
            pval_adj: 0.02,
            neuropath_type: 'AAA'
        }]
    };
    tissueToFilter: string = '';
    modelToFilter: string = '';

    // Observable string sources
    chartsReadySource = new Subject<boolean>();
    chartsRenderedSource = new Subject<boolean>();

    // Observable string streams
    chartsReady$ = this.chartsReadySource.asObservable();
    chartsRendered$ = this.chartsRenderedSource.asObservable();

    constructor() {
        //
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) { this.chartInfos.set(label, chartObj); }
    }

    addChartName(name: string) {
        if (name && this.chartNames.has(name)) { this.chartNames.set(name, true); }

        if (this.allChartsLoaded()) {
            this.chartsReadySource.next(true);
        } else {
            this.chartsReadySource.next(false);
        }
    }

    allChartsLoaded() {
        let loaded = true;
        for (const value of this.chartNames.values()) {
            if (!value) {
                loaded = false;
                break;
            }
        }

        return loaded;
    }

    allChartsRendered(): boolean {
        let loaded = true;

        for (const value of this.chartRendered.values()) {
            if (!value) {
                loaded = false;
                break;
            }
        }

        return loaded;
    }

    getChartInfo(label: string): any {
        return mockInfo1;
    }

    removeChart(chart: any, group?: any, dimension?: any) {
        if (chart) {
            if (group) {
                chart.filterAll(group);
            }
            if (dimension) {
                dimension.filterAll();
            }
            dc.chartRegistry.deregister(chart);
            chart.resetSvg();
        }
    }

    addChartRendered(name: string) {
        if (this.chartRendered) {
            if (name && this.chartRendered.has(name)) { this.chartRendered.set(name, true); }

            if (this.allChartsRendered()) {
                this.chartsRenderedSource.next(true);
            } else {
                this.chartsRenderedSource.next(false);
            }
        }
    }

    removeChartName(name: string) {
        //
    }

    getTooltipText(text: string): string {
        return 'CBE';
    }
}

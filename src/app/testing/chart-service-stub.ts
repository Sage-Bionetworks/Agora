import { Injectable } from '@angular/core';

import * as dc from 'dc';

import { Subject } from 'rxjs';

import { mockInfo1 } from './gene-mocks';

@Injectable()
export class ChartServiceStub {
    chartInfos: Map<string, any> = new Map<string, any>();
    chartNames: Map<string, boolean> = new Map([
        ['median-chart', false],
        ['box-plot', false],
        ['forest-plot', false],
        ['select-model', false]
    ]);
    queryFilter: any = {
        smGroup: null,
        bpGroup: null,
        fpGroup: null,
        mcGroup: null
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
        }
    };
    tissueToFilter: string = '';
    modelToFilter: string = '';

    // Observable string sources
    chartsReadySource = new Subject<boolean>();

    // Observable string streams
    chartsReady$ = this.chartsReadySource.asObservable();

    constructor() {
        //
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) { this.chartInfos.set(label, chartObj); }
    }

    addChartName(name: string) {
        if (name && this.chartNames.has(name)) { this.chartNames.set(name, true); }

        if (this.allChartsLoaded()) { this.chartsReadySource.next(true); }
    }

    allChartsLoaded() {
        return true;
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

    getTooltipText(text: string): string {
        return 'CBE';
    }
}

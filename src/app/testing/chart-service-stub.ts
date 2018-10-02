import { Injectable } from '@angular/core';

import * as dc from 'dc';

@Injectable()
export class ChartServiceStub {
    chartInfos: Map<string, any> = new Map<string, any>();

    constructor() {
        //
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) { this.chartInfos.set(label, chartObj); }
    }

    getChartInfo(label: string): any {
        return this.chartInfos.get(label);
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
}

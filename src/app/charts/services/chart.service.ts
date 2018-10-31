import { Injectable } from '@angular/core';

import * as dc from 'dc';

import { Subject } from 'rxjs';

@Injectable()
export class ChartService {
    chartInfos: Map<string, any> = new Map<string, any>();
    chartNames: Map<string, boolean> = new Map([
        ['median', false],
        ['box', false],
        ['forest', false],
        // ['select-tissue', false],
        ['select-model', false]
    ]);
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
        if (label && !this.chartInfos.has(label)) { this.chartInfos.set(label, chartObj); }
    }

    addChartName(name: string) {
        if (name && this.chartNames.has(name)) { this.chartNames.set(name, true); }

        if (this.allChartsLoaded()) { this.chartsReadySource.next(true); }
    }

    removeChartName(name: string) {
        if (name && this.chartNames[name]) { this.chartNames[name].set(false); }
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

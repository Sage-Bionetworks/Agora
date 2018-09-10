import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {
    private chartInfos: Map<string, any> = new Map<string, any>();

    constructor() {
        //
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) { this.chartInfos.set(label, chartObj); }
    }

    getChartInfo(label: string): any {
        return this.chartInfos.get(label);
    }
}

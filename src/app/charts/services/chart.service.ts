import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../models';

@Injectable()
export class ChartService {
    private chartInfos: Map<string, any> = new Map<string, any>();

    constructor(
        private decimalPipe: DecimalPipe
    ) { }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) { this.chartInfos.set(label, chartObj); }
    }

    getChartInfo(label: string): any {
        return this.chartInfos.get(label);
    }
}

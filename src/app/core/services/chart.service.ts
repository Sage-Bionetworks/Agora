import { Injectable, ContentChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class ChartService {
    private chartInfos: Map<string, any> = new Map<string, any>();
    private ndx: any;
    private data: any;

    constructor(
        private decimalPipe: DecimalPipe
    ) { }

    getData() {
        return this.data;
    }

    setData(data: any) {
        this.data = data;
        this.ndx = crossfilter(data);
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) this.chartInfos.set(label, chartObj);
    }

    getChartInfo(label: string): any {
        return this.chartInfos.get(label);
    }

    getDimension(label: string): CrossFilter.Dimension<any, any> {
        this.chartInfos.get(label).dim = this.ndx.dimension(this.chartInfos.get(label).dimension);
        return this.chartInfos.get(label).dim;
    }

    getGroup(label: string): CrossFilter.Group<any, any, any> {
        // Self case
        if (this.chartInfos.get(label).group === 'self') {
            this.chartInfos.get(label).g = this.chartInfos.get(label).dim.group();
        // Self-avg case
        } else if (this.chartInfos.get(label).group === 'self-avg') {
            this.chartInfos.get(label).g = this.chartInfos.get(label).dim.group().reduce(
                this.reduceAddAvg('logFC'),
                this.reduceRemoveAvg('logFC'),
                this.reduceInitAvg);
        }
        return this.chartInfos.get(label).g;
    }

    // Reduce functions for average
    reduceAddAvg(attr) {
        let self = this;
        return function(p,v) {
            if (v[attr] !== 'NA') {
                ++p.count
                p.sum += Number(v[attr]);
                p.avg = p.sum/p.count;
            }
            return p;
        };
    }

    reduceRemoveAvg(attr) {
        let self = this;
        return function(p,v) {
            if (v[attr] !== 'NA') {
                --p.count
                p.sum -= Number(v[attr]);
                p.avg = p.count ? p.sum/p.count : 0;
            }
            return p;
        };
    }

    reduceInitAvg() {
        return {count:0, sum:0, avg:0};
    }
}
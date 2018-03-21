import { Injectable, ContentChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../models';

import { GeneService } from './';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class ChartService {
    private chartInfos: Map<string, any> = new Map<string, any>();
    private ndx: any;
    private data: any;
    self = this;
    test = 0;

    constructor(
        private decimalPipe: DecimalPipe,
        private geneService: GeneService
    ) { }

    getData() {
        return this.data;
    }

    setData(data: any) {
        this.data = data;
        this.ndx = crossfilter(data);
    }

    getNdx() {
        return this.ndx;
    }

    addChartInfo(label: string, chartObj: any) {
        if (!this.chartInfos[label]) this.chartInfos.set(label, chartObj);
    }

    getChartInfo(label: string): any {
        return this.chartInfos.get(label);
    }

    getDimension(label: string): CrossFilter.Dimension<any, any> {
        let self = this;
        let info = this.chartInfos.get(label);
        let dimValue = info.dimension;
        let dim = this.ndx.dimension(function(d) {
            switch(info.type) {
                case 'forest-plot':
                    if (info.filter) {
                        let filterGene = self.geneService.getCurrentGene();
                        return (d.hgnc_symbol === filterGene.hgnc_symbol) ? d[dimValue[0]] : '';
                    } else {
                        return d[dimValue[0]];
                    }
                case 'scatter-plot':
                    return [
                        Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]],
                        Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]],
                        d[dimValue[2]]
                    ];
                case 'select-menu':
                    if (info.filter) {
                        let filterGene = self.geneService.getCurrentGene();
                        return (d.hgnc_symbol === filterGene.hgnc_symbol) ? d[dimValue[0]] : '';
                    } else {
                        return d[dimValue[0]];
                    }
                default:
                    return [
                        Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]],
                        Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]]
                    ];
            }
        });

        info.dim = dim;
        return info.dim;
    }

    getGroup(label: string): CrossFilter.Group<any, any, any> {
        let info = this.chartInfos.get(label);
        let group = info.dim.group();
        if (info.attr) {
            group.reduce(
                // callback for when data is added to the current filter results
                this.reduceAddAvg(info.attr),
                this.reduceRemoveAvg(info.attr),
                this.reduceInitAvg
            );
        }
        if (info.filter) {
            group = this.remove_empty_bins(group);
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for average
    reduceAddAvg(attr: string) {
        return function (p, v) {
            if (!Number.isNaN(+v[attr]) && v[attr] != 'NA') {
                ++p.count;
                p[attr] += +v[attr];
            }
            return p;
        }
    }

    reduceRemoveAvg(attr: string) {
        return function (p, v) {
            if (!Number.isNaN(+v[attr]) && v[attr] != 'NA') {
                --p.count;
                p[attr] -= +v[attr];
            }
            return p;
        }
    }

    reduceInitAvg() {
        return {count:0, sum:0, logFC:0};
    }

    remove_empty_bins = (source_group) => {
        return {
            all: () => {
                return source_group.all().filter(function(d) {
                    // here your condition
                    return d.key !== null && d.key !== '' && d.value !== 0; // etc.
                });
            }
        };
    }
}
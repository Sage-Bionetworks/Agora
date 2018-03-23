import { Injectable, Input } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../models';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import colorbrewer from 'colorbrewer';

@Injectable()
export class DataService {
    private ndx: any;
    private data: any;
    private tableData: any = [];

    private hgncDim: any;
    private tissuesDim: any;
    private modelsDim: any;

    private genesCollection: AngularFirestoreCollection<Gene>;
    private dbgenes: Observable<Gene[]>;

    constructor(
        private http: HttpClient,
        private afs: AngularFirestore,
        private decimalPipe: DecimalPipe
    ) {
        //this.genesCollection = this.afs.collection('genes'); // reference
        //this.dbgenes = this.genesCollection.valueChanges(); // observable of genes data
    }

    getNdx() {
        return this.ndx;
    }

    loadGenesFile(fname: string): Promise<boolean> {
        let self = this;
        return new Promise((resolve, reject) => {
            // This will be done once at the server
            d3.csv('/assets/data/' + fname, (data) => {
                data.forEach((d) => {
                    // Separate the columns we need
                    d.logFC = self.decimalPipe.transform(+d.logFC);
                    d.neg_log10_adj_P_Val = self.decimalPipe.transform(+d.neg_log10_adj_P_Val);
                    d.AveExpr = self.decimalPipe.transform(+d.AveExpr);
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.comparison_model_sex = d.comparison_model_sex;
                    d.tissue_study_pretty = d.tissue_study_pretty;
                });

                self.ndx = crossfilter(data);
                self.data = data;
                self.hgncDim = self.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });
                self.tissuesDim = self.ndx.dimension((d) => {
                    return [d.hgnc_symbol, d.tissue_study_pretty];
                });
                self.modelsDim = self.ndx.dimension((d) => {
                    return [d.hgnc_symbol, d.comparison_model_sex];
                });

                self.tableData = self.hgncDim.group().reduce(
                    /* callback for when data is added to the current filter results */
                    function (p, v) {
                        ++p.count;
                        p.AveExpr += +v.AveExpr;
                        return p;
                    },
                    /* callback for when data is removed from the current filter results */
                    function (p, v) {
                        --p.count;
                        p.AveExpr -= +v.AveExpr;
                        return p;
                    },
                    /* initialize p */
                    function () {
                        return {
                            count: 0,
                            AveExpr: 0
                        };
                    }
                ).top(Infinity).map((te) => {
                    return <Gene>{ hgnc_symbol: te.key, AveExpr: te.value.AveExpr }
                });

                if (self.tableData) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })
    }

    getTableData() {
        return this.tableData;
    }

    getModelsDim() {
        return this.modelsDim;
    }

    getTissuesDim() {
        return this.tissuesDim;
    }

    // Charts crossfilter handling part
    getDimension(label: string, info:any, filterGene: Gene, filterTissues: string[], filterModels: string[]): CrossFilter.Dimension<any, any> {
        let self = this;
        let dimValue = info.dimension;
        let allTissues: Map<string, any> = new Map<string, any>();

        let dim = this.getNdx().dimension(function(d) {
            switch(info.type) {
                case 'forest-plot':
                    if (info.filter) {
                        let rvalue: any = '';
                        if (!filterTissues.some((t) => { return t === d[dimValue[0]]; })) {
                            if (!allTissues[d[dimValue[0]]]) {
                                allTissues[d[dimValue[0]]] = { added: false };
                            }
                            if (!allTissues[d[dimValue[0]]].added) {
                                allTissues[d[dimValue[0]]].added = true;
                                rvalue = d[dimValue[0]];
                            }
                        }

                        if (d.hgnc_symbol === filterGene.hgnc_symbol) {
                            rvalue = d[dimValue[0]];
                        }
                        return rvalue;
                    } else {
                        return d[dimValue[0]];
                    }
                case 'scatter-plot':
                    // Calculate x and y binning with each bin being PIXEL_BIN_SIZE wide.
                    // Binning coordinates into bins such that 1-2 bins per pixel makes
                    // crossfilter operations more efficient, especially with large
                    // datasets
                    let nXBins = 540;
                    let nYBins = 335;
                    let binWidth = 20 / nXBins;
                    let binHeight = 20 / nYBins;
                    let minLogFC: number = 0.5;
                    let minNegLogAdjPVal: number = 10;
                    let x = Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]];
                    let y = Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]];

                    if ((d.hgnc_symbol !== filterGene.hgnc_symbol &&
                        Math.abs(+d[dimValue[0]]) < minLogFC &&
                        Math.abs(+d[dimValue[1]]) < minNegLogAdjPVal) ||
                        !filterTissues.some((t) => { return t === d.tissue_study_pretty; })) {
                        x = 0;
                        y = 0;
                    }

                    return [
                        Math.floor(x / binWidth) * binWidth,
                        Math.floor(y / binHeight) * binHeight,
                        d[dimValue[2]]
                    ];
                    //return [x, y, d[dimValue[2]]];
                case 'select-menu':
                    if (info.filter) {
                        if (dimValue[0] === 'comparison_model_sex') {
                            return (filterModels.some((t) => { return t === d[dimValue[0]]})) ? d[dimValue[0]] : '';
                        } else if (dimValue[0] === 'tissue_study_pretty') {
                            return (filterTissues.some((t) => { return t === d[dimValue[0]]})) ? d[dimValue[0]] : '';
                        }
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

    getGroup(label: string, info: any): CrossFilter.Group<any, any, any> {
        //let info = this.chartInfos.get(label);
        let group = info.dim.group();
        if (info.attr) {
            group.reduce(
                // callback for when data is added to the current filter results
                this.reduceAdd(info.attr, (info.constraint) ? info.constraint : null),
                this.reduceRemove(info.attr, (info.constraint) ? info.constraint : null),
                this.reduceInit
            );
        }
        if (info.filter) {
            if (info.filter === 'default') {
                group = this.rmEmptyBinsDefault(group)
            } else if (info.filter === 'custom') {
                group = this.rmEmptyBinsCustom(group);
            }
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for average
    reduceAdd(attr: string, constraint?: any) {
        let self = this;
        return function (p, v) {
            if (!Number.isNaN(+v[attr]) && v[attr] != 'NA') {
                if (constraint && constraint.names.some((t) => { return t === v[constraint.attr]; })) {
                    p[attr] += +v[attr];
                } else {
                    p[attr] += 0;
                }
                ++p.count;

            }
            return p;
        }
    }

    reduceRemove(attr: string, constraint?: any) {
        let self = this;
        return function (p, v) {
            if (!Number.isNaN(+v[attr]) && v[attr] != 'NA') {
                if (constraint && constraint.names.some((t) => { return t === v[constraint.attr]; })) {
                    p[attr] -= +v[attr];
                } else {
                    p[attr] -= 0;
                }
                --p.count;
            }
            return p;
        }
    }

    reduceInit() {
        return {count:0, sum:0, logFC:0};
    }

    rmEmptyBinsDefault = (source_group) => {
        return {
            all: () => {
                return source_group.all().filter(function(d) {
                    // here your condition
                    return d.key !== null && d.key !== '';
                });
            }
        };
    }

    rmEmptyBinsCustom = (source_group) => {
        return {
            all: () => {
                return source_group.all().filter(function(d) {
                    // here your condition
                    return +d.key[0] !== 0 || +d.key[1] !== 0;
                });
            }
        };
    }
}

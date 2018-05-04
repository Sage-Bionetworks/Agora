import { Injectable, Input } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../models';

import { LazyLoadEvent } from 'primeng/primeng';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import colorbrewer from 'colorbrewer';

@Injectable()
export class DataService {
    tissuesMap = new Map<string, any>();
    private ndx: any;
    private data: any;
    private hgncDim: any;
    private tissuesDim: any;
    private modelsDim: any;
    private dbgenes: Observable<Gene[]>;

    constructor(
        private http: HttpClient,
        private decimalPipe: DecimalPipe
    ) {}

    getNdx() {
        return this.ndx;
    }

    loadGenes(): Promise<boolean> {
        const self = this;
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const params = new HttpParams();

            // Get all the genes to render the charts
            this.http.get('/api/genes', { headers, params }).subscribe((data) => {
                data['items'].forEach((d) => {
                    // Separate the columns we need
                    d.logfc = self.decimalPipe.transform(+d.logfc, '1.1-5');
                    d.neg_log10_adj_p_val = self.decimalPipe.transform(
                        +d.neg_log10_adj_p_val,
                        '1.1-5'
                    );
                    d.aveexpr = self.decimalPipe.transform(+d.aveexpr, '1.1-5');
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.comparison_model_sex = d.comparison_model_sex_pretty;
                    d.tissue_study_pretty = d.tissue_study_pretty;
                });

                self.ndx = crossfilter(data['items']);
                self.data = data['items'];

                self.hgncDim = self.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });

                resolve(true);
            });
        });
    }

    loadGenesFile(fname: string): Promise<boolean> {
        const self = this;
        return new Promise((resolve, reject) => {
            // This will be done once at the server
            d3.csv('/assets/data/' + fname, (data) => {
                data.forEach((d) => {
                    // Separate the columns we need
                    d.logfc = self.decimalPipe.transform(+d.logfc, '1.1-5');
                    d.neg_log10_adj_p_val = self.decimalPipe.transform(
                        +d.neg_log10_adj_p_val,
                        '1.1-5'
                    );
                    d.aveexpr = self.decimalPipe.transform(+d.aveexpr, '1.1-5');
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.comparison_model_sex = d.comparison_model_sex_pretty;
                    d.tissue_study_pretty = d.tissue_study_pretty;
                });

                self.ndx = crossfilter(data);
                self.data = data;

                self.hgncDim = self.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });

                resolve(true);
            });
        });
    }

    getTableData(paramsObj?: LazyLoadEvent) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();

        for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                params = params.append(key, paramsObj[key]);
            }
        }

        return this.http.get('/api/genes/page', { headers, params });
    }

    getGenesMatchId(id: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/genes/' + id, { headers });
    }

    getGene(id: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/gene/' + id, { headers });
    }

    getGenesDimension() {
        return this.hgncDim;
    }

    // Charts crossfilter handling part
    getDimension(label: string, info: any, filterGene: Gene, filterTissues: string[],
                 filterModels: string[]): CrossFilter.Dimension<any, any> {
        const self = this;
        const dimValue = info.dimension;
        const allTissues: Map<string, any> = new Map<string, any>();

        const dim = this.getNdx().dimension(function(d) {
            switch (info.type) {
                case 'forest-plot':
                    if (info.filter) {
                        // The key returned
                        let rvalue: any = '';
                        if (!filterTissues.some((t) => t === d[dimValue[0]])) {
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
                    const x = Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]];
                    const y = Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]];

                    return [x, y, d[dimValue[2]]];
                case 'select-menu':
                    if (info.filter) {
                        if (dimValue[0] === 'comparison_model_sex') {
                            return (filterModels.some((t) => t === d[dimValue[0]])) ?
                                    d[dimValue[0]] :
                                    '';
                        } else if (dimValue[0] === 'tissue_study_pretty') {
                            return (filterTissues.some((t) => t === d[dimValue[0]])) ?
                                    d[dimValue[0]] :
                                    '';
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
            group = this.rmEmptyBinsDefault(group);
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for constraint charts
    reduceAdd(attr: string, constraint?: any) {
        const self = this;
        return (p, v) => {
            if (!Number.isNaN(+v[attr]) && v[attr] !== 'NA') {
                if (constraint && constraint.names.some((t) => t === v[constraint.attr])) {
                    p[attr] += +v[attr];
                } else {
                    p[attr] += 0;
                }
                ++p.count;

            }
            return p;
        };
    }

    reduceRemove(attr: string, constraint?: any) {
        const self = this;
        return (p, v) => {
            if (!Number.isNaN(+v[attr]) && v[attr] !== 'NA') {
                if (constraint && constraint.names.some((t) => t === v[constraint.attr])) {
                    p[attr] -= +v[attr];
                } else {
                    p[attr] -= 0;
                }
                --p.count;
            }
            return p;
        };
    }

    reduceInit() {
        return {count: 0, sum: 0, logfc: 0};
    }

    rmEmptyBinsDefault = (sourceGroup) => {
        return {
            all: () => {
                return sourceGroup.all().filter(function(d) {
                    // Add your filter condition here
                    return d.key !== null && d.key !== '';
                });
            }
        };
    }

    rmEmptyBinsCustom = (sourceGroup, tissue?: string, model?: string) => {
        return {
            all: () => {
                return sourceGroup.all().filter(function(d) {
                    // Add your filter condition here
                    return +d.key[0] !== 0 || +d.key[1] !== 0;
                });
            }
        };
    }
}

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
    private ndx: any;
    private data: any;
    private hgncDim: any;
    private tissuesDim: any;
    private modelsDim: any;

    private dbgenes: Observable<Gene[]>;

    tissuesMap = new Map<string, any>();

    constructor(
        private http: HttpClient,
        private decimalPipe: DecimalPipe
    ) {}

    getNdx() {
        return this.ndx;
    }

    loadNodes(sgene): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const params = new HttpParams();
            const dic = [];

            this.http.get(`/api/genelist/${sgene.ensembl_gene_id}`).subscribe((data: object[]) => {
                const genes: any = {
                    links: [],
                    nodes: [{
                        id: sgene.ensembl_gene_id,
                        group: 1,
                        name: sgene.hgnc_symbol
                    }]
                };
                const dnodes = [];
                const enodes: object[] = data['items'].filter((node: any) => {
                    return node.geneA_ensembl_gene_id === sgene.ensembl_gene_id;
                });
                data['items'].forEach((obj: any) => {
                    if (!dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]) {
                        const link: any = {
                            value: 1,
                            source: obj.geneA_ensembl_gene_id,
                            target: obj.geneB_ensembl_gene_id,
                            brainregions: [obj.brainRegion]
                        };
                        dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] = link;
                        genes.links = [...genes.links,
                        dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]];
                    } else {
                        dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id].value++;
                        dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                        .brainregions.push(obj.brainRegion);
                    }
                    if (obj.geneA_ensembl_gene_id === sgene.ensembl_gene_id
                        && !dnodes[obj.geneB_ensembl_gene_id]) {
                        const node = {
                            id: obj.geneB_ensembl_gene_id,
                            group: 1,
                            name: obj.geneB_external_gene_name
                        };
                        genes.nodes = [...genes.nodes, node];
                        dnodes[obj.geneB_ensembl_gene_id] = true;
                    }
                });
                resolve(genes);
            });
        });
    }

    loadGenes(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const params = new HttpParams();

            // Get all the genes to render the charts
            this.http.get('/api/genes', { headers, params }).subscribe((data) => {
                console.log(data);
                data['items'].forEach((d) => {
                    // Separate the columns we need
                    d.logFC = this.decimalPipe.transform(+d.logFC, '1.1-5');
                    d.neg_log10_adj_P_Val = this
                    .decimalPipe.transform(+d.neg_log10_adj_P_Val, '1.1-5');
                    d.AveExpr = this.decimalPipe.transform(+d.AveExpr, '1.1-5');
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.comparison_model_sex = d.comparison_model_sex_pretty;
                    d.tissue_study_pretty = d.tissue_study_pretty;
                });

                this.ndx = crossfilter(data['items']);
                this.data = data['items'];

                this.hgncDim = this.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });

                resolve(true);
            });
        });
    }

    loadGenesFile(fname: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // This will be done once at the server
            d3.csv(`/assets/data/${fname}`).then( (data) => {
                data.forEach((d) => {
                    // Separate the columns we need
                    d.logFC = this.decimalPipe.transform(+d.logFC, '1.1-5');
                    d.neg_log10_adj_P_Val = this.decimalPipe
                    .transform(+d.neg_log10_adj_P_Val, '1.1-5');
                    d.AveExpr = this.decimalPipe.transform(+d.AveExpr, '1.1-5');
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.comparison_model_sex = d.comparison_model_sex_pretty;
                    d.tissue_study_pretty = d.tissue_study_pretty;
                });
                this.ndx = crossfilter(data);
                this.data = data;

                this.hgncDim = this.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });

                resolve(true);
            });
        });
    }

    getTableData(paramsObj?: LazyLoadEvent) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();

        for (var key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                params = params.append(key, paramsObj[key]);
            }
        }

        return this.http.get('/api/genes/page', { headers, params });
    }

    getGenesMatchId(id: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/genes/' + id, { headers });
    }

    getGene(id: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/gene/' + id, { headers });
    }

    getGenesDimension() {
        return this.hgncDim;
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
                    let nXBins = 400;
                    let nYBins = 300;
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
            group = this.rmEmptyBinsDefault(group);
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for constraint charts
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

    rmEmptyBinsCustom = (source_group, tissue?: string, model?: string) => {
        return {
            all: () => {
                return source_group.all().filter(function(d) {
                    // Add your filter condition here
                    return +d.key[0] !== 0 || +d.key[1] !== 0;
                });
            }
        };
    }
}

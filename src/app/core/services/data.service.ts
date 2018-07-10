import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { Gene, GeneInfo } from '../../models';

import { LazyLoadEvent } from 'primeng/primeng';

import { Observable } from 'rxjs';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class DataService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    ndx: any;
    data: any;
    hgncDim: any;
    tissuesDim: any;
    modelsDim: any;
    dbgenes: Observable<Gene[]>;
    geneEntries: Gene[];

    constructor(
        private http: HttpClient,
        private decimalPipe: DecimalPipe
    ) {}

    getNdx() {
        return this.ndx;
    }

    loadNodes(sgene: Gene): Promise<any> {
        return new Promise((resolve, reject) => {
            let dataLinks: any;
            this.http.get(`/api/genelist/${sgene.ensembl_gene_id}`).subscribe((data: object[]) => {
                dataLinks = data;
            }, (error) => {
                console.log('Error loading genes! ' + error.message);
            }, () => {
                resolve(dataLinks);
            });
        });
    }

    loadGenes(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const params = new HttpParams();

            // Get all the genes to render the charts
            this.http.get('/api/genes', { headers, params }).subscribe((data: Gene[]) => {
                if (data['geneEntries']) { this.geneEntries = data['geneEntries']; }
                data['items'].forEach((d: Gene) => {
                    // Separate the columns we need
                    d.logfc = +this.decimalPipe.transform(+d.logfc, '1.1-5');
                    d.fc = +this.decimalPipe.transform(+d.fc, '1.1-5');
                    d.adj_p_val = +d.adj_p_val;
                    d.hgnc_symbol = d.hgnc_symbol;
                    d.model = d.model;
                    d.study = d.study;
                    d.tissue = d.tissue;
                });

                this.ndx = crossfilter(data['items']);
                this.data = data['items'];

                this.hgncDim = this.ndx.dimension((d) => {
                    return d.hgnc_symbol;
                });
            }, (error) => {
                console.log('Error loading genes! ' + error.message);
            }, () => {
                resolve(true);
            });
        });
    }

    getPageData(paramsObj?: LazyLoadEvent): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();

        for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                params = params.append(key, paramsObj[key]);
            }
        }

        return this.http.get('/api/genes/page', { headers, params });
    }

    getTableData(): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams();

        return this.http.get('/api/genes/table', { headers, params });
    }

    getGenesMatchId(id: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/genes/' + id, { headers });
    }

    getGene(id: string, tissue?: string, model?: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set(
            'id', id
        );
        if (tissue) {
            params = params.set(
                'tissue', tissue
            );
        }
        if (model) {
            params = params.set(
                'model', model
            );
        }

        return this.http.get('/api/gene/', { headers, params });
    }

    getTeams(info: GeneInfo): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = new HttpParams().set(
            'teams', info.nominatedtarget.map((e) => e.team).join(', ')
        );

        return this.http.get('/api/teams', { headers, params });
    }

    getTeamMemberImage(name: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'image/jpg',
            'Accept': 'image/jpg',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        const params = new HttpParams().set(
            'name', name
        );

        return this.http.get('/api/team/image', { headers, params, responseType: 'arraybuffer' });
    }

    getGeneEntries(): Gene[] {
        return this.geneEntries;
    }

    getGenesDimension(): crossfilter.Dimension<any, any> {
        return this.hgncDim;
    }

    // Charts crossfilter handling part
    getDimension(info: any, filterGene?: Gene): crossfilter.Dimension<any, any> {
        const dimValue = info.dimension;

        const dim = this.getNdx().dimension(function(d) {
            switch (info.type) {
                case 'forest-plot':
                    // The key returned
                    let rvalue: any = '';

                    if (d.hgnc_symbol === filterGene.hgnc_symbol) {
                        rvalue = d[dimValue[0]];
                    }
                    return rvalue;
                case 'scatter-plot':
                    const x = Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]];
                    const y = Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]];

                    return [x, y, d[dimValue[2]]];
                case 'box-plot':
                    return 1;
                case 'select-menu':
                    return d[dimValue[0]];
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

    getGroup(info: any): crossfilter.Group<any, any, any> {
        let group = info.dim.group();

        // If we want to reduce based on certain parameters
        if (info.attr || info.format) {
            group.reduce(
                // callback for when data is added to the current filter results
                this.reduceAdd(
                    info.attr,
                    (info.format) ? info.format : null,
                    (info.constraints) ? info.constraints : null
                ),
                this.reduceRemove(
                    info.attr,
                    (info.format) ? info.format : null,
                    (info.constraints) ? info.constraints : null
                ),
                (info.format) ? this.reduceInitial : this.reduceInit
            );
        }

        if (info.filter) {
            group = this.rmEmptyBinsDefault(group);
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for constraint charts
    reduceAdd(attr: string, format?: string, constraints?: any[]) {
        return (p, v) => {
            let val = +v[attr];

            if (format && format === 'array') {
                if (val !== 0 && constraints[0].name === v[constraints[0].attr]) {
                    val = (attr === 'fc') ? Math.log2(val) : Math.log10(val);
                    if (!Number.isNaN(val)) { p.push(val); }
                }
                return p;
            } else {
                p[attr] += val;
            }
            ++p.count;
            return p;
        };
    }

    reduceRemove(attr: string, format?: string, constraints?: any[]) {
        return (p, v) => {
            let val = +v[attr];

            if (format && format === 'array') {
                if (val !== 0 && constraints[0].name === v[constraints[0].attr]) {
                    val = (attr === 'fc') ? Math.log2(val) : Math.log10(val);
                    if (!Number.isNaN(val)) { p.splice(p.indexOf(val), 1); }
                }
                return p;
            } else {
                p[attr] -= val;
            }
            --p.count;
            return p;
        };
    }

    reduceInit() {
        return {count: 0, sum: 0, logfc: 0, fc: 0, adj_p_val: 0};
    }

    // Box-plot uses a different function name in dc.js
    reduceInitial() {
        return [];
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
}

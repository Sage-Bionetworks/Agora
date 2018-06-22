import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../models';

import { LazyLoadEvent } from 'primeng/primeng';

import { Observable } from 'rxjs/Observable';

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
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const params = new HttpParams();
            const dic = [];

            this.http.get(`/api/genelist/${sgene.ensembl_gene_id}`).subscribe((data: object[]) => {
                const dnodes = [];
                const genes: any = {
                    links: [],
                    nodes: []
                };
                dnodes[sgene.ensembl_gene_id] = {
                    id: sgene.ensembl_gene_id,
                    ensembl_gene_id: sgene.ensembl_gene_id,
                    group: 1,
                    hgnc_symbol: sgene.hgnc_symbol,
                    brainregions: []
                };
                genes.nodes = [...genes.nodes, dnodes[sgene.ensembl_gene_id]];
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
                        if (dnodes[obj.geneA_ensembl_gene_id]
                            .brainregions.indexOf(obj.brainRegion) === -1) {
                            dnodes[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                        }
                    } else {
                        if (dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                            .brainregions.indexOf(obj.brainRegion) === -1) {
                            dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id].value++;
                            dic[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                                .brainregions.push(obj.brainRegion);
                            } else {
                            console.log(`repeted brainRegion: ${obj.brainRegion} in
                             ${obj.geneA_ensembl_gene_id} --> ${obj.geneA_ensembl_gene_id} link`);
                            }
                        if (dnodes[obj.geneA_ensembl_gene_id]
                            .brainregions.indexOf(obj.brainRegion) === -1) {
                            dnodes[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                        }
                        dnodes[obj.geneB_ensembl_gene_id].hide = true;
                        dnodes[obj.geneA_ensembl_gene_id].hide = true;
                    }
                    if (obj.geneA_ensembl_gene_id === sgene.ensembl_gene_id
                        && !dnodes[obj.geneB_ensembl_gene_id]) {
                        const node = {
                            id: obj.geneB_ensembl_gene_id,
                            ensembl_gene_id: obj.geneB_ensembl_gene_id,
                            group: 1,
                            hgnc_symbol: obj.geneB_external_gene_name,
                            brainregions: [obj.brainRegion]
                        };
                        dnodes[obj.geneB_ensembl_gene_id] = node;
                        genes.nodes = [...genes.nodes, dnodes[obj.geneB_ensembl_gene_id]];
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
            this.http.get('/api/genes', { headers, params }).subscribe((data: Gene[]) => {
                if (data['geneEntries']) { this.geneEntries = data['geneEntries']; }
                data['items'].forEach((d: Gene) => {
                    // Separate the columns we need
                    d.logfc = +this.decimalPipe.transform(+d.logfc, '1.1-5');
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

                resolve(true);
            });
        });
    }

    getTableData(paramsObj?: LazyLoadEvent): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams();

        for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                params = params.append(key, paramsObj[key]);
            }
        }

        return this.http.get('/api/genes/page', { headers, params });
    }

    getGenesMatchId(id: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/genes/' + id, { headers });
    }

    getGene(id: string): Observable<object> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get('/api/gene/' + id, { headers });
    }

    getGeneEntries() {
        return this.geneEntries;
    }

    getGenesDimension() {
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
                    return (info.constraintNames.some((t) => t === d[dimValue[0]])) ? 1 : '';
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
        if (info.attr || info.constraint || info.format) {
            group.reduce(
                // callback for when data is added to the current filter results
                this.reduceAdd(
                    info.attr,
                    (info.constraint) ? info.constraint : null,
                    (info.format) ? info.format : null
                ),
                this.reduceRemove(
                    info.attr,
                    (info.constraint) ? info.constraint : null,
                    (info.format) ? info.format : null
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
    reduceAdd(attr: string, constraint?: any, format?: string) {
        return (p, v) => {
            let val = 0;
            // Using tissue constraint for the forest and box plots
            if (constraint) {
                if (constraint.names.some((t) => t === v[constraint.attr])) {
                    val = +v[attr];
                }
            } else {
                val = +v[attr];
            }

            if (format && format === 'array') {
                p.push(val);
                return p;
            } else {
                p[attr] += val;
            }
            ++p.count;
            return p;
        };
    }

    reduceRemove(attr: string, constraint?: any, format?: string) {
        return (p, v) => {
            let val = 0;
            // Using tissue constraint for the forest and box plots
            if (constraint) {
                if (constraint && constraint.names.some((t) => t === v[constraint.attr])) {
                    val = +v[attr];
                }
            } else {
                val = +v[attr];
            }

            if (format && format === 'array') {
                if (val) { p.splice(p.indexOf(val), 1); }
                return p;
            } else {
                p[attr] -= val;
            }
            --p.count;
            return p;
        };
    }

    reduceInit() {
        return {count: 0, sum: 0, logfc: 0, adj_p_val: 0};
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

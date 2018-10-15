import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ApiService, ForceService } from '.';

import { Gene, GenesResponse, LinksListResponse, GeneNetwork } from '../../models';

import { Observable, forkJoin } from 'rxjs';

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
    // To be used by the DecimalPipe from Angular. This means
    // a minimum of 1 digit will be shown before decimal point,
    // at least, but not more than, 2 digits after decimal point
    significantDigits: string = '1.2-2';
    // This is a second configuration used because the adjusted
    // p-val goes up to 4 significant digits. It is used to compare
    // the log fold change with adjusted p-val for chart rendering
    // methods
    compSignificantDigits: string = '1.2-4';

    constructor(
        private apiService: ApiService,
        private forceService: ForceService,
        private decimalPipe: DecimalPipe
    ) {}

    getNdx(): any {
        return this.ndx;
    }

    clearNdx() {
        this.ndx.remove();
    }

    loadData(gene: Gene): Observable<any[]> {
        const genesResponse = this.apiService.getGenes();
        const nodesResponse = this.apiService.getLinksList(gene);
        const tissuesResponse = this.apiService.getGeneTissues();
        const modelsResponse = this.apiService.getGeneModels();

        return forkJoin([
            genesResponse,
            nodesResponse,
            tissuesResponse,
            modelsResponse
        ]);
    }

    loadTissuesModels(gene: Gene): Observable<any[]> {
        const tissuesResponse = this.apiService.getGeneTissues();
        const modelsResponse = this.apiService.getGeneModels();

        return forkJoin([
            tissuesResponse,
            modelsResponse
        ]);
    }

    loadNodes(gene: Gene): Promise<GeneNetwork> {
        return this.forceService.processNodes(gene);
    }

    loadSelectedNodes(sList: LinksListResponse, sNode: Gene): Promise<GeneNetwork> {
        return this.forceService.processSelectedNode(sList, sNode);
    }

    loadGenes(data: GenesResponse) {
        if (data.geneEntries) { this.geneEntries = data.geneEntries; }
        data.items.forEach((d: Gene) => {
            // Separate the columns we need
            d.logfc = this.getSignificantValue(+d.logfc, true);
            d.fc = this.getSignificantValue(+d.fc, true);
            d.adj_p_val = this.getSignificantValue(+d.adj_p_val, true);
            d.hgnc_symbol = d.hgnc_symbol;
            d.model = d.model;
            d.study = d.study;
            d.tissue = d.tissue;
        });

        this.ndx = crossfilter(data.items);
        this.data = data.items;

        this.hgncDim = this.ndx.dimension((d) => {
            return d.hgnc_symbol;
        });
    }

    getGeneEntries(): Gene[] {
        return this.geneEntries;
    }

    getSignificantDigits(compare?: boolean): string {
        return ((compare) ? this.compSignificantDigits : this.significantDigits) || '1.2-2';
    }

    getSignificantValue(value: number, compare?: boolean) {
        return +this.decimalPipe.transform(value, this.getSignificantDigits(compare));
    }

    setSignificantDigits(sd: string) {
        this.significantDigits = sd;
    }

    getGenesDimension(): crossfilter.Dimension<any, any> {
        return this.hgncDim;
    }

    // Charts crossfilter handling part
    getDimension(info: any, filterGene?: Gene): crossfilter.Dimension<any, any> {
        const dimValue = info.dimension;

        const dim = this.getNdx().dimension((d) => {
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

    reduceInit(): any {
        return {count: 0, sum: 0, logfc: 0, fc: 0, adj_p_val: 0};
    }

    // Box-plot uses a different function name in dc.js
    reduceInitial(): any[] {
        return [];
    }

    rmEmptyBinsDefault = (sourceGroup): any => {
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

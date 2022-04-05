import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ApiService, ForceService } from '.';

import { Gene, GenesResponse, RnaDistribution } from '../../models';

import { Observable, forkJoin } from 'rxjs';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class DataService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    ndx: any;
    rowChartNdx: any;
    data: any;
    hgncDim: any;
    tissuesDim: any;
    modelsDim: any;
    dbgenes: Observable<Gene[]>;
    geneEntries: Gene[];
    evidenceData: any;
    rnaDistributionData: RnaDistribution[];
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

    loadData(gene: Gene): Observable<any[]> {
        const genesResponse = this.apiService.getGenes(gene.ensembl_gene_id);
        const nodesResponse = this.apiService.getLinksList(gene);
        const evidenceResponse = this.apiService.getEvidencenData(gene.ensembl_gene_id);

        return forkJoin([
            genesResponse,
            nodesResponse,
            evidenceResponse
        ]);
    }

    loadNodes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.forceService.processNodes();
            resolve(true);
        });
    }

    loadGenes(data: GenesResponse) {
        if (data.geneEntries) {
            this.setGeneEntries(data.geneEntries);
        }
    }

    getGeneEntries(): Gene[] {
        return this.geneEntries;
    }

    setGeneEntries(genes: Gene[]) {
        this.geneEntries = genes;
    }

    getSignificantFigures(n: number, sig: number = 2) {
        let sign = 1;
        if (n === 0) {
            return 0;
        }
        if (n < 0) {
            n *= -1;
            sign = -1;
        }

        const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
        return (Math.round(n * mult) / mult) * sign;
    }

    setSignificantDigits(sd: string) {
        this.significantDigits = sd;
    }

    getGenesDimension(): crossfilter.Dimension<any, any> {
        return this.hgncDim;
    }

    // Assuming the rows are already properly formatted
    exportToCsv(filename: string, rows: string[]) {
        let csvFile: string = '';
        rows.forEach((r) => {
            csvFile += (r + '\n');
        });

        const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    setEvidenceData(data: any) {
        this.evidenceData = data;
    }

    getEvidenceData(): Gene[] {
        return this.evidenceData;
    }

    setRnaDistributionData(data) {
        this.rnaDistributionData = data;
    }

    loadRnaDistributionData(data) {
        if (data) {
            this.setRnaDistributionData(data);
        }
    }

    getRnaDistributionData(): RnaDistribution[] {
        return this.rnaDistributionData;
    }
}

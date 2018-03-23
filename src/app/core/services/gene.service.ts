import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DataService } from './';

import { Gene } from '../../models';

@Injectable()
export class GeneService {
    private currentGene: Gene;
    private models: string[] = [];
    private tissues: string[] = [];

    // Genes max and min values
    maxAdjPVal: number = -Infinity;
    minLogFC: number = +Infinity;
    maxLogFC: number = -Infinity;
    ci_L: number = +Infinity;
    ci_R: number = -Infinity;

    constructor(
        private decimalPipe: DecimalPipe,
        private dataService: DataService
    ) {

    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene() {
        return this.currentGene;
    }

    getTissues(): string[] {
        return this.tissues;
    }

    getModels(): string[] {
        return this.models;
    }

    filterTissuesModels(gene: Gene): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // Don't apply a filter to the dimension here
            this.dataService.getModelsDim().top(Infinity).filter((g) => {
                if (+g.logFC > this.maxLogFC) this.maxLogFC = +g.logFC;
                if (+g.logFC < this.minLogFC) this.minLogFC = +g.logFC;
                if (+g.neg_log10_adj_P_Val > this.maxAdjPVal) this.maxAdjPVal = +g.neg_log10_adj_P_Val;
                if (+g.CI_L < this.ci_L) this.ci_L = +g.CI_L;
                if (+g.CI_R > this.ci_R) this.ci_R = +g.CI_R;

                if (g.hgnc_symbol === gene.hgnc_symbol) {
                    this.models.push(g.comparison_model_sex);
                    this.tissues.push(g.tissue_study_pretty);
                }
            });
            this.models = this.models.filter((value, index, array) => {
                return array.indexOf(value) === index;
            });
            this.tissues = this.tissues.filter((value, index, array) => {
                return array.indexOf(value) === index;
            });

            resolve(true);
        });
    }
}

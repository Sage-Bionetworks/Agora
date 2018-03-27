import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DataService } from './';

import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GeneService {
    private currentGene: Gene;
    private currentTissue: string;
    private currentModel: string;
    private models: string[] = [];
    private tissues: string[] = [];

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

    setCurrentTissue(tissue: string) {
        this.currentTissue = tissue;
    }

    getCurrentTissue() {
        return this.currentTissue;
    }

    setCurrentModel(model: string) {
        this.currentModel = model;
    }

    getCurrentModel() {
        return this.currentModel;
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
            this.dataService.getGenesDimension().top(Infinity).forEach((g) => {
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
            //this.setCurrentTissue(this.tissues[0]);

            resolve(true);
        });
    }
}

import { Injectable } from '@angular/core';

import { Gene } from '../models';
import { GeneService, DataService } from '../core/services';

@Injectable()
export class GeneServiceStub {
    currentGene: Gene;
    currentTissue: string;
    currentModel: string;
    models: string[] = [];
    tissues: string[] = [];
    minFC: number = 0;
    maxFC: number = 10;
    maxAdjPValue: number = 50;
    minAdjPValue: number = 0;

    setLogFC(min: number, max: number) {
        this.minFC = min;
        this.maxFC = max;
    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    setAdjPValue(max: number, min?: number) {
        this.maxAdjPValue = max;
        this.minAdjPValue = (min) ? min : 0;
    }
}

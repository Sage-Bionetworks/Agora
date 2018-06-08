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
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxNegLogPValue: number = 50;
    minNegLogPValue: number = 0;

    setLogFC(min: number, max: number) {
        this.minLogFC = min;
        this.maxLogFC = max;
    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    setNegAdjPValue(max: number, min?: number) {
        this.maxNegLogPValue = max;
        this.minNegLogPValue = (min) ? min : 0;
    }
}

import { Injectable } from '@angular/core';

import { Gene } from '../models';

@Injectable()
export class GeneServiceStub {
    private currentGene: Gene;
    private currentTissue: string;
    private currentModel: string;
    private models: string[] = [];
    private tissues: string[] = [];
    private minLogFC: number = 0;
    private maxLogFC: number = 10;
    private maxNegLogPValue: number = 50;
    private minNegLogPValue: number = 0;

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

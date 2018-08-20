import { Injectable, EventEmitter } from '@angular/core';

import { GeneNetwork } from '../models/geneLink';

@Injectable()
export class ForceServiceStub {
    datachange: EventEmitter<GeneNetwork> = new EventEmitter();

    getGenes(): EventEmitter<GeneNetwork> {
        return this.datachange;
    }
}

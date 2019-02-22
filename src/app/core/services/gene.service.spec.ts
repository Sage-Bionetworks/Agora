import {
    TestBed
} from '@angular/core/testing';

import {
    GeneServiceStub, ApiServiceStub, mockGene1
} from '../../testing';

import { ApiService, GeneService } from './';
import { Gene } from 'app/models';

describe('Service: Gene: TestBed', () => {
    let geneService: GeneService;
    let apiService: ApiServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GeneService,
                { provide: ApiService, useValue: new ApiServiceStub() }
            ]
        });

        geneService = TestBed.get(GeneService);
        apiService = TestBed.get(ApiService);
    });

    it('should create an instance', () => {
        expect(geneService).toBeDefined();
    });

    it('should get and set the current gene', () => {
        const gcglSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();
        const scglSpy = spyOn(geneService, 'setCurrentGene').and.callThrough();
        const currentGene1: Gene = geneService.getCurrentGene();
        expect(currentGene1).toEqual(undefined);

        geneService.setCurrentGene(mockGene1);
        expect(scglSpy).toHaveBeenCalled();
        const currentGene2: Gene = geneService.getCurrentGene();
        expect(currentGene2).toEqual(geneService.currentGene);
        expect(gcglSpy).toHaveBeenCalled();
        expect(gcglSpy).toHaveBeenCalledTimes(2);
    });
});

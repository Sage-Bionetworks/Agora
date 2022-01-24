import {
    TestBed
} from '@angular/core/testing';
import { ApiService, GeneService } from './';
import {
    ApiServiceStub,
    mockGene1,
    mockGeneResponse1,
    mockGeneResponseNoGeneItem,
    mockGeneResponseNoExpValidation,
    mockGeneResponseNoScores
} from '../../testing';
import {
    Gene,
    GeneExpValidation,
    GeneInfo,
    GeneOverallScores,
    GeneResponse
} from 'app/models';

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

        geneService = TestBed.inject(GeneService);
        apiService = TestBed.inject(ApiService);
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

    // AG-293
    xit('should update the previous gene with the current gene', () => {
        const upgSpy = spyOn(geneService, 'updatePreviousGene').and.callThrough();
        geneService.setCurrentGene(mockGene1);
        expect(geneService.getCurrentGene()).toEqual(mockGene1);
        expect(geneService.getPreviousGene()).toEqual(undefined);

        geneService.updatePreviousGene();
        expect(upgSpy).toHaveBeenCalled();
        expect(geneService.getPreviousGene()).toEqual(mockGene1);
    });

    it('should not update the previous gene if no current gene', () => {
        const upgSpy = spyOn(geneService, 'updatePreviousGene').and.callThrough();
        expect(geneService.getCurrentGene()).toEqual(undefined);
        expect(geneService.getPreviousGene()).toEqual(undefined);

        geneService.updatePreviousGene();
        expect(upgSpy).toHaveBeenCalled();
        expect(geneService.getPreviousGene()).toEqual(undefined);
    });

    it('should update all gene data', () => {
        testUpdateGeneData(mockGeneResponse1);
    });

    it('should update gene data when no genes', () => {
        testUpdateGeneData(mockGeneResponseNoGeneItem);
        const currentGene: Gene = geneService.getCurrentGene();
        expect(currentGene).toEqual(null);
    });

    it('should update gene data when no expValidation', () => {
        testUpdateGeneData(mockGeneResponseNoExpValidation);
        const currentExpValidation: GeneExpValidation[] = geneService.getCurrentExpValidation();
        expect(currentExpValidation).toEqual(null);
    });

    it('should update gene data when no overallScore', () => {
        testUpdateGeneData(mockGeneResponseNoScores);

        const currentGeneOverallScores: GeneOverallScores = geneService.getCurrentGeneOverallScores();
        expect(currentGeneOverallScores).toEqual(null);
    });

    function testUpdateGeneData(mockGeneResponse: GeneResponse) {
        const ugdSpy = spyOn(geneService, 'updateGeneData').and.callThrough();
        const scgSpy = spyOn(geneService, 'setCurrentGene').and.callThrough();
        const sciSpy = spyOn(geneService, 'setCurrentInfo').and.callThrough();
        const scevSpy = spyOn(geneService, 'setCurrentExpValidation').and.callThrough();
        const scmSpy = spyOn(geneService, 'setCurrentModel').and.callThrough();
        const sctSpy = spyOn(geneService, 'setCurrentTissue').and.callThrough();
        const scsSpy = spyOn(geneService, 'setCurrentGeneOverallScores').and.callThrough();

        geneService.updateGeneData(mockGeneResponse);
        expect(ugdSpy).toHaveBeenCalled();
        expect(scgSpy).toHaveBeenCalled();
        expect(sciSpy).toHaveBeenCalled();
        expect(scevSpy).toHaveBeenCalled();
        expect(scmSpy).toHaveBeenCalled();
        expect(sctSpy).toHaveBeenCalled();
        expect(scsSpy).toHaveBeenCalled();

        const currentGene: Gene = geneService.getCurrentGene();
        expect(currentGene).toEqual(geneService.currentGene);

        const currentInfo: GeneInfo = geneService.getCurrentInfo();
        expect(currentInfo).toEqual(geneService.currentInfo);

        const currentExpValidation: GeneExpValidation[] = geneService.getCurrentExpValidation();
        expect(currentExpValidation).toEqual(geneService.currentExpValidation);

        const currentModel: string = geneService.getCurrentModel();
        expect(currentModel).toEqual(geneService.currentModel);

        const currentTissue: string = geneService.getCurrentTissue();
        expect(currentTissue).toEqual(geneService.currentTissue);

        const currentGeneOverallScores: GeneOverallScores = geneService.getCurrentGeneOverallScores();
        expect(currentGeneOverallScores).toEqual(geneService.currentGeneOverallScores);
    }
});

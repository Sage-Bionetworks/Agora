import {
    TestBed
} from '@angular/core/testing';

import {
    GeneServiceStub
} from '../../testing';

import { ForceService, GeneService } from './';

import { GeneNetwork, GeneNetworkLinks } from 'app/models';

describe('Service: Force: TestBed', () => {
    let forceService: ForceService;
    let geneService: GeneServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ForceService,
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        });

        forceService = TestBed.inject(ForceService);
        geneService = TestBed.inject(GeneService);
    });

    it('should create an instance', () => {
        expect(forceService).toBeDefined();
        expect(geneService).toBeDefined();
    });

    it('should set the initial data', () => {
        const sdSpy = spyOn(forceService, 'setData').and.callThrough();
        const data: GeneNetworkLinks[] = [{
            geneA_ensembl_gene_id: 'ENSG00000268903',
            geneB_ensembl_gene_id: 'ENSG00000150337',
            brainRegion: 'DLPFC',
            geneA_external_gene_name: 'AL627309.6',
            geneB_external_gene_name: 'FCGR1A'
        }];
        expect(JSON.stringify(forceService.rawData)).toEqual(JSON.stringify([]));
        expect(JSON.stringify(forceService.dicNodes)).toEqual(JSON.stringify([]));
        expect(JSON.stringify(forceService.dicLinks)).toEqual(JSON.stringify([]));
        expect(JSON.stringify(forceService.dicGroup)).toEqual(JSON.stringify([]));

        forceService.setData(data);
        expect(sdSpy).toHaveBeenCalledWith(data);
        expect(JSON.stringify(forceService.rawData)).toEqual(JSON.stringify(data));
        expect(JSON.stringify(forceService.dicNodes)).toEqual(JSON.stringify([]));
        expect(JSON.stringify(forceService.dicLinks)).toEqual(JSON.stringify([]));
        expect(JSON.stringify(forceService.dicGroup)).toEqual(JSON.stringify([]));
    });

    it('should get the original gene list', () => {
        const ggolSpy = spyOn(forceService, 'getGeneOriginalList').and.callThrough();
        const geneOriginalList1 = forceService.getGeneOriginalList();
        expect(geneOriginalList1).toEqual(null);

        forceService.genes.links.length = 1;
        forceService.genes.nodes.length = 1;
        const geneOriginalList2 = forceService.getGeneOriginalList();
        expect(geneOriginalList2).toEqual(forceService.genes);
        expect(ggolSpy).toHaveBeenCalled();
        expect(ggolSpy).toHaveBeenCalledTimes(2);
    });

    it('should get the clicked gene list', () => {
        const ggclSpy = spyOn(forceService, 'getGeneClickedList').and.callThrough();
        const geneOriginalList1: GeneNetwork = forceService.getGeneClickedList();
        expect(geneOriginalList1).toEqual(null);

        forceService.genesClicked.links.length = 1;
        forceService.genesClicked.nodes.length = 1;
        const geneOriginalList2: GeneNetwork = forceService.getGeneClickedList();
        expect(geneOriginalList2).toEqual(forceService.genesClicked);
        expect(ggclSpy).toHaveBeenCalled();
        expect(ggclSpy).toHaveBeenCalledTimes(2);
    });

    it('should get and set the links list items', () => {
        const ggclSpy = spyOn(forceService, 'getLinksListItems').and.callThrough();
        const sgclSpy = spyOn(forceService, 'setLinksListItems').and.callThrough();
        const geneLinksList1: GeneNetworkLinks[] = forceService.getLinksListItems();
        expect(geneLinksList1).toEqual(undefined);

        forceService.setLinksListItems([]);
        expect(sgclSpy).toHaveBeenCalled();
        const geneOriginalList2: GeneNetworkLinks[] = forceService.getLinksListItems();
        expect(geneOriginalList2).toEqual(forceService.linksListItems);
        expect(ggclSpy).toHaveBeenCalled();
        expect(ggclSpy).toHaveBeenCalledTimes(2);
    });
});

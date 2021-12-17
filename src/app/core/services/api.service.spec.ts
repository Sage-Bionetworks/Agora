import {
    TestBed
} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import {
    mockGene1,
    mockInfo1,
    mockGenesResponse,
    mockLinksListResponse,
    mockTeam1,
    mockTissues,
    mockModels
} from '../../testing';

import { ApiService } from './';
import { GeneInfosResponse, TeamInfoDocument } from 'app/models';

describe('Service: Api: TestBed', () => {
    let apiService: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ ApiService ]
        });

        apiService = TestBed.get(ApiService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create an instance', () => {
        expect(apiService).toBeDefined();
    });

    it('should get the links list data from the server', () => {
        const dummyLinksList = mockLinksListResponse;

        apiService.getLinksList(mockGene1).subscribe((response) => {
            expect(response).toEqual(mockLinksListResponse);
        });

        const req = httpMock.expectOne(`/api/genelist/${mockGene1.ensembl_gene_id}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyLinksList);
    });

    it('should get the genes data from the server', () => {
        const dummyGenes = mockGenesResponse;

        apiService.getGenes('VGF').subscribe((response) => {
            expect(response).toEqual(mockGenesResponse);
        });

        const req = httpMock.expectOne('/api/genes?id=VGF');
        expect(req.request.method).toBe('GET');
        req.flush(dummyGenes);
    });

    it('should get the genes table data from the server', () => {
        const res = { items: [mockInfo1] };

        apiService.getTableData().subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/genes/table');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get the gene infos that match an id data from the server', () => {
        const res: GeneInfosResponse = { items: [mockInfo1] };

        apiService.getInfosMatchId('VGF').subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/gene/infos/VGF');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get the genes infos that match ids data from the server', () => {
        const res: GeneInfosResponse = { items: [mockInfo1] };

        apiService.getInfosMatchIds(['VGF']).subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/mgenes/infos?ids=VGF');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get the gene data from the server', () => {
        const res = { mockInfo1, mockGene1 };
        apiService.getGene('VGF', 'DLPFC', 'AD+Diagnosis+%28males+and+females%29')
            .subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne(
            (r) => r.url.includes('gene')
        );
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get a team data from the server using a gene info', () => {
        const res: any = [mockTeam1];

        apiService.getTeams(mockInfo1).subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/teams?teams=Emory');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get all the team members data from the server', () => {
        const res: any = [mockTeam1];

        apiService.getAllTeams().subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/teams/all');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get a the team member image data from the server', () => {
        const res: ArrayBuffer = new ArrayBuffer(0);

        apiService.getTeamMemberImage('Rima Kaddurah-Daouk').subscribe((response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne('/api/team/image?name=Rima%20Kaddurah-Daouk');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should get all the team members images data from the server', () => {
        const res: ArrayBuffer = new ArrayBuffer(0);

        apiService.getTeamMemberImages(mockTeam1.members).subscribe((response) => {
            expect(response).toEqual([res]);
        });

        const req = httpMock.expectOne('/api/team/image?name=Rima%20Kaddurah-Daouk');
        httpMock.expectOne('/api/team/image?name=Colette%20Blach');
        httpMock.expectOne('/api/team/image?name=Andrew%20Saykin');
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });

    it('should trigger a refresh for the charts on the server', () => {
        const res: string[] = mockModels;

        apiService.refreshChartsData('AD Diagnosis (males and females)', 'VGF').subscribe(
            (response) => {
            expect(response).toEqual(res);
        });

        const req = httpMock.expectOne(
            '/api/refresh?filter=' + JSON.stringify('AD Diagnosis (males and females)') + '&id=VGF'
        );
        expect(req.request.method).toBe('GET');
        req.flush(res);
    });
});

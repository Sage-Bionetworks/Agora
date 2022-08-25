// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { ApiService } from './';
import {
  geneMock1,
  geneMock2,
  gctGeneMock1,
  nominatedGeneMock1,
  distributionMock,
  mockTeamMember,
  teamsResponseMock,
} from '../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: API', () => {
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(apiService).toBeDefined();
  });

  it('should get data from /api/genes/:id', () => {
    const geneMock = geneMock1;

    apiService.getGene(geneMock1.ensembl_gene_id).subscribe((response) => {
      expect(response).toEqual(geneMock1);
    });

    const req = httpMock.expectOne('/api/genes/' + geneMock1.ensembl_gene_id);
    expect(req.request.method).toBe('GET');
    req.flush(geneMock);
  });

  it('should get data from /api/genes', () => {
    const mockResponse = { items: [geneMock1, geneMock2] };

    apiService
      .getGenes([geneMock1.ensembl_gene_id, geneMock2.ensembl_gene_id])
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      '/api/genes?ids=' +
        geneMock1.ensembl_gene_id +
        ',' +
        geneMock2.ensembl_gene_id
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/search?id=' + geneMock1.ensembl_gene_id, () => {
    const mockResponse = { items: [geneMock1] };

    apiService.searchGene(geneMock1.ensembl_gene_id).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      '/api/genes/search?id=' + geneMock1.ensembl_gene_id
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/search?id=' + geneMock1.hgnc_symbol, () => {
    const mockResponse = { items: [geneMock1] };

    apiService.searchGene(geneMock1.hgnc_symbol).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      '/api/genes/search?id=' + geneMock1.hgnc_symbol
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/genes/comparison', () => {
    const mockResponse = { items: [gctGeneMock1] };

    apiService
      .getComparisonGenes(
        'RNA - Differential Expression',
        'AD Diagnosis (males and females)'
      )
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      '/api/genes/comparison?category=RNA%20-%20Differential%20Expression&subCategory=AD%20Diagnosis%20(males%20and%20females)'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/genes/nominated', () => {
    const mockResponse = { items: [nominatedGeneMock1] };

    apiService.getNominatedGenes().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/genes/nominated');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/distribution', () => {
    const mockResponse = distributionMock;

    apiService.getDistribution().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/distribution');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/teams', () => {
    const mockResponse = teamsResponseMock;

    apiService.getTeams().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/teams');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get data from /api/team-member/marty-mcfly/image', () => {
    const mockResponse: ArrayBuffer = new ArrayBuffer(0);
    const teamMemberName = mockTeamMember.name
      .toLowerCase()
      .replace(/[- ]/g, '-');

    apiService.getTeamMemberImage(teamMemberName).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      '/api/team-member/' + teamMemberName + '/image'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

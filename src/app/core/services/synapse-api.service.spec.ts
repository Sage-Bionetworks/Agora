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
import { SynapseApiService } from './';
import { synapseWikiMock } from '../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Synapse API', () => {
  let synapseApiService: SynapseApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SynapseApiService],
    });

    synapseApiService = TestBed.inject(SynapseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(synapseApiService).toBeDefined();
  });

  it('should get data from Synapse API', () => {
    synapseApiService
      .getWiki('syn25913473', synapseWikiMock.id)
      .subscribe((response) => {
        expect(response).toEqual(synapseWikiMock);
      });

    const req = httpMock.expectOne(
      'https://repo-prod.prod.sagebase.org/repo/v1/entity/syn25913473/wiki/' +
        synapseWikiMock.id
    );
    expect(req.request.method).toBe('GET');
    req.flush(synapseWikiMock);
  });
});

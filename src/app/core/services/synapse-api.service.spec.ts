// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SynapseApiService } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Synapse API', () => {
  let synapseApiService: SynapseApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SynapseApiService],
    });

    synapseApiService = TestBed.inject(SynapseApiService);
  });

  it('should create', () => {
    expect(synapseApiService).toBeDefined();
  });
});

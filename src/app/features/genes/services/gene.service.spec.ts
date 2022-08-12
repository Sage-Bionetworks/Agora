// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneService } from './';
import { ApiService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Gene', () => {
  let errorService: GeneService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneService, ApiService],
    });

    errorService = TestBed.inject(GeneService);
  });

  it('should create', () => {
    expect(errorService).toBeDefined();
  });
});

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { ErrorService } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Error', () => {
  let errorService: ErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ErrorService, MessageService],
    });

    errorService = TestBed.inject(ErrorService);
  });

  it('should create', () => {
    expect(errorService).toBeDefined();
  });
});

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneEvidenceProteomicsComponent } from './';
import { GeneService } from '../../services';
import { ApiService, HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Proteomics', () => {
  let fixture: ComponentFixture<GeneEvidenceProteomicsComponent>;
  let component: GeneEvidenceProteomicsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneEvidenceProteomicsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneEvidenceProteomicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

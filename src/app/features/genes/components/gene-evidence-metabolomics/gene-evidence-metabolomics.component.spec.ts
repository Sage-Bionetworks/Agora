// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneEvidenceMetabolomicsComponent } from './';
import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Metabolomics', () => {
  let fixture: ComponentFixture<GeneEvidenceMetabolomicsComponent>;
  let component: GeneEvidenceMetabolomicsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneEvidenceMetabolomicsComponent],
      imports: [RouterTestingModule],
      providers: [GeneService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneEvidenceMetabolomicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

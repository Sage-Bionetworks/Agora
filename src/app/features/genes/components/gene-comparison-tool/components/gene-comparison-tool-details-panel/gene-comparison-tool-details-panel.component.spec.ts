// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolDetailsPanelComponent } from './';
import { HelperService } from '../../../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Details Panel', () => {
  let fixture: ComponentFixture<GeneComparisonToolDetailsPanelComponent>;
  let component: GeneComparisonToolDetailsPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolDetailsPanelComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

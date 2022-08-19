// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolLegendPanelComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Legend Panel', () => {
  let fixture: ComponentFixture<GeneComparisonToolLegendPanelComponent>;
  let component: GeneComparisonToolLegendPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolLegendPanelComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolLegendPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

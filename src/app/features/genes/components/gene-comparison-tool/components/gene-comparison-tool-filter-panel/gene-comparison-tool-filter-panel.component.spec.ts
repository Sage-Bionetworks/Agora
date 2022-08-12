// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolFilterPanelComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Filter Panel', () => {
  let fixture: ComponentFixture<GeneComparisonToolFilterPanelComponent>;
  let component: GeneComparisonToolFilterPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolFilterPanelComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

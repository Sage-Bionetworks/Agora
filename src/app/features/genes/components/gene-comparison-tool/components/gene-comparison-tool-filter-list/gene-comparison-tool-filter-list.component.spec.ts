// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolFilterListComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Filter List', () => {
  let fixture: ComponentFixture<GeneComparisonToolFilterListComponent>;
  let component: GeneComparisonToolFilterListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolFilterListComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

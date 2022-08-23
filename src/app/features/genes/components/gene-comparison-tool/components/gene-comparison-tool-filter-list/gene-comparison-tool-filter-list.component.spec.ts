// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolFilterListComponent } from './';
import { HelperService } from '../../../../../../core/services';
import { gctFiltersMocks } from '../../../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Filter List', () => {
  let fixture: ComponentFixture<GeneComparisonToolFilterListComponent>;
  let component: GeneComparisonToolFilterListComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolFilterListComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
    component.filters = JSON.parse(JSON.stringify(gctFiltersMocks));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    expect(component.filters).toEqual(gctFiltersMocks);
  });

  it('should display filters', () => {
    expect(
      element.querySelectorAll('.gct-filter-list-item').length
    ).not.toEqual(0);
  });

  it('should remove filter', () => {
    const clearButton = element.querySelector(
      '.gct-filter-list-item:first-child .gct-filter-list-item-clear'
    ) as HTMLElement;
    clearButton.click();
    fixture.detectChanges();

    expect(component.filters[0].options[0].selected).toEqual(false);
  });

  it('should remove all filters', () => {
    const clearButton = element.querySelector(
      '.gct-filter-list-clear-all'
    ) as HTMLElement;
    clearButton.click();
    fixture.detectChanges();

    for (const filter of component.filters) {
      for (const option of filter.options) {
        expect(option.selected).toEqual(false);
      }
    }
  });
});

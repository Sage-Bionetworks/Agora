import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GeneComparisonToolFilterListComponent } from '.';

import { GCTFilter } from '../..';

const mockFilters: GCTFilter[] = [
  {
    name: 'test',
    label: 'Test',
    options: [
      { label: '1', value: 1, selected: true },
      { label: '2', value: 2, selected: true },
      { label: '3', value: 3, selected: true },
    ],
  },
];

describe('Component: GeneComparisonToolFilterListComponent', () => {
  let component: GeneComparisonToolFilterListComponent;
  let fixture: ComponentFixture<GeneComparisonToolFilterListComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GeneComparisonToolFilterListComponent],
      // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
      // elements and attributes
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneComparisonToolFilterListComponent);
    component = fixture.componentInstance; // Component test instance
    component.filters = JSON.parse(JSON.stringify(mockFilters));
    fixture.detectChanges();
    tick();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    // Check if filters has data
    expect(component.filters?.length).not.toEqual(0);

    // Check if html elements have been created
    const items = fixture.debugElement.nativeElement.querySelectorAll(
      '.gct-filter-list-item'
    );
    expect(items?.length).not.toEqual(0);
  });

  it('should remove filter', fakeAsync(() => {
    // Clear first filter with click event
    const clearButton = fixture.debugElement.nativeElement.querySelector(
      '.gct-filter-list-item:first-child .gct-filter-list-item-clear'
    );
    clearButton.click();

    fixture.detectChanges();
    tick();

    // Make sure the first filter is unselected
    expect(component.filters[0].options[0].selected).toEqual(false);
  }));

  it('should remove all filters', fakeAsync(() => {
    // Clear all filters with click event
    const clearButton = fixture.debugElement.nativeElement.querySelector(
      '.gct-filter-list-clear-all'
    );
    clearButton.click();

    fixture.detectChanges();
    tick();

    // Make sure all the filter are unselected
    for (const filter of component.filters) {
      for (const option of filter.options) {
        expect(option.selected).toEqual(false);
      }
    }
  }));
});

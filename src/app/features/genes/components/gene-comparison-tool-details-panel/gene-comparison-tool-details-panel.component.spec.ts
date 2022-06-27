import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GeneComparisonToolDetailsPanelComponent } from '.';

import { GCDetailsPanelData } from '../..';

const mockData: GCDetailsPanelData = {
  label: 'label',
  heading: 'heading',
  subHeading: 'subHeading',
  value: 5,
  valueLabel: 'valueLabel',
  pValue: 5,
  min: 0,
  max: 10,
  footer: 'footer',
};

describe('Component: GeneComparisonToolDetailsPanelComponent', () => {
  let component: GeneComparisonToolDetailsPanelComponent;
  let fixture: ComponentFixture<GeneComparisonToolDetailsPanelComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GeneComparisonToolDetailsPanelComponent, OverlayPanel],
      // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
      // elements and attributes
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NoopAnimationsModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneComparisonToolDetailsPanelComponent);
    component = fixture.componentInstance; // Component test instance
    fixture.detectChanges();
    component.show({}, JSON.parse(JSON.stringify(mockData)));
    fixture.detectChanges();
    tick();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    // Check if filters has data
    expect(component.data).toEqual(mockData);
  });

  it('should have label', fakeAsync(() => {
    // Check if html element is valid
    const label = fixture.debugElement.nativeElement.querySelector(
      '.gct-details-panel-label'
    );
    expect(label?.innerHTML.trim()).toEqual(mockData.label);
  }));

  it('should have heading', () => {
    // Check if html element is valid
    const heading = fixture.debugElement.nativeElement.querySelector(
      '.gct-details-panel-heading'
    );
    expect(heading?.innerHTML.trim()).toEqual(mockData.heading);
  });

  it('should have subHeading', () => {
    // Check if html element is valid
    const subHeading = fixture.debugElement.nativeElement.querySelector(
      '.gct-details-panel-sub-heading'
    );
    expect(subHeading?.innerHTML.trim()).toEqual(mockData.subHeading);
  });

  it('should have values', () => {
    // Check if html element is valid
    const elements = fixture.debugElement.nativeElement.querySelectorAll(
      '.gct-details-panel-data > div > div'
    );
    expect(elements?.length).toEqual(4);

    expect(elements[0]?.innerHTML.trim()).toEqual(
      mockData.valueLabel.toString()
    );
    expect(elements[2]?.innerHTML.trim()).toEqual(mockData.value.toString());
    expect(elements[3]?.innerHTML.trim()).toEqual(mockData.pValue.toString());
  });

  it('should have marker', fakeAsync(() => {
    // Check if html element is valid
    const marker = fixture.debugElement.nativeElement.querySelector(
      '.gct-details-panel-range > div > div > div'
    );
    expect(marker).toBeTruthy();
    expect(component.getMarkerStyle(mockData)).toEqual({ left: '50%' });
  }));

  it('should have footer', () => {
    // Check if html element is valid
    const footer = fixture.debugElement.nativeElement.querySelector(
      '.gct-details-panel-footer'
    );
    expect(footer?.innerHTML?.trim()).toEqual(mockData.footer);
  });
});

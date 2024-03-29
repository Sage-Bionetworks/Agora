// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { BoxPlotComponent } from './';
import { HelperService } from '../../../../core/services';
import { boxPlotChartItemMock } from '../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Chart - Box Plot', () => {
  let fixture: ComponentFixture<BoxPlotComponent>;
  let component: BoxPlotComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxPlotComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(BoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message if not data', () => {
    expect(component.data?.length).toEqual(0);
    expect(element.querySelector('.chart-no-data')).toBeTruthy();
  });

  it('should render the chart', () => {
    const idSpy = spyOn(component, 'initData').and.callThrough();
    const icSpy = spyOn(component, 'initChart').and.callThrough();

    component.data = [boxPlotChartItemMock];
    fixture.detectChanges();

    expect(idSpy).toHaveBeenCalled();
    expect(icSpy).toHaveBeenCalled();
    expect(element.querySelector('svg')).toBeTruthy();
  });

  it('should have circle', () => {
    component.data = [boxPlotChartItemMock];
    component.renderCircles();
    fixture.detectChanges();
    expect(element.querySelectorAll('svg circle')?.length).not.toEqual(0);
  });

  it('should have tooltips', () => {
    component.data = [boxPlotChartItemMock];
    component.renderCircles();
    component.addXAxisTooltips();
    fixture.detectChanges();
    expect(
      document.querySelector('.box-plot-chart-x-axis-tooltip')
    ).toBeTruthy();
    expect(
      document.querySelector('.box-plot-chart-value-tooltip')
    ).toBeTruthy();
  });
});

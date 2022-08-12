// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { MedianChartComponent } from './';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Chart - Median', () => {
  let fixture: ComponentFixture<MedianChartComponent>;
  let component: MedianChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedianChartComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(MedianChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

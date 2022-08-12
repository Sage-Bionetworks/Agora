// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { CandlestickChartComponent } from './';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Chart - Candlestick', () => {
  let fixture: ComponentFixture<CandlestickChartComponent>;
  let component: CandlestickChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandlestickChartComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CandlestickChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

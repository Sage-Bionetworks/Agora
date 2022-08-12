// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { ScoreChartComponent } from './';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Chart - Score', () => {
  let fixture: ComponentFixture<ScoreChartComponent>;
  let component: ScoreChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoreChartComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

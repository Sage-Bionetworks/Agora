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

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Chart - Box Plot', () => {
  let fixture: ComponentFixture<BoxPlotComponent>;
  let component: BoxPlotComponent;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

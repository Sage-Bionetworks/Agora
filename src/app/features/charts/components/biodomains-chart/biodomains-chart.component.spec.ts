// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { BiodomainsChartComponent } from './';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Biodomains Chart', () => {
  let fixture: ComponentFixture<BiodomainsChartComponent>;
  let component: BiodomainsChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BiodomainsChartComponent],
      imports: [RouterTestingModule],
      providers: [ HelperService ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(BiodomainsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

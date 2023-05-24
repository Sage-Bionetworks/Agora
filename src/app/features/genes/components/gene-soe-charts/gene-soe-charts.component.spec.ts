// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneSoeChartsComponent } from './';
import { GeneService } from '../../services';
import { ApiService } from '../../../../core/services';
import { OverallScoresDistribution } from '../../../../models';
import { overallScoresMock1 } from '../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene SOE Charts', () => {
  let fixture: ComponentFixture<GeneSoeChartsComponent>;
  let component: GeneSoeChartsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneSoeChartsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneSoeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort target risk score first', () => {
    const data: OverallScoresDistribution[] = overallScoresMock1;
    component.sortScoreDistributions(data);
    expect(data[0].name).toBe('Target Risk Score');
  });

  it('should sort genetic risk score second', () => {
    const data: OverallScoresDistribution[] = overallScoresMock1;
    component.sortScoreDistributions(data);
    expect(data[1].name).toBe('Genetic Risk Score');
  });

  it('should sort multi-omic risk score last', () => {
    const data: OverallScoresDistribution[] = overallScoresMock1;
    component.sortScoreDistributions(data);
    expect(data[2].name).toBe('Multi-omic Risk Score');
  });
});

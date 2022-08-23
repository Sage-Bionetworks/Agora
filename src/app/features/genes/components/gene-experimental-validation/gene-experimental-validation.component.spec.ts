// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { ExperimentalValidationComponent } from './';
import { GeneService } from '../../services';
import { ApiService, HelperService } from '../../../../core/services';
import { TeamService } from '../../../teams/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Experimental Validation', () => {
  let fixture: ComponentFixture<ExperimentalValidationComponent>;
  let component: ExperimentalValidationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperimentalValidationComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, TeamService, ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ExperimentalValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneDruggabilityComponent } from './';
import { GeneService } from '../../services';
import { ApiService, HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Druggability', () => {
  let fixture: ComponentFixture<GeneDruggabilityComponent>;
  let component: GeneDruggabilityComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneDruggabilityComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneDruggabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

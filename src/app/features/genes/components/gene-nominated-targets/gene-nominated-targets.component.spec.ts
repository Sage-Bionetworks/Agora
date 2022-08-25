// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneNominatedTargetsComponent } from './';
import { ApiService, HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Nominated Targets', () => {
  let fixture: ComponentFixture<GeneNominatedTargetsComponent>;
  let component: GeneNominatedTargetsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneNominatedTargetsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneNominatedTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

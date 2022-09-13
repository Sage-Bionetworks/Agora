// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneNominationsComponent } from './';
import { ApiService } from '../../../../core/services';
import { TeamService } from '../../../teams/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Nominations', () => {
  let fixture: ComponentFixture<GeneNominationsComponent>;
  let component: GeneNominationsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneNominationsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ApiService, TeamService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneNominationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

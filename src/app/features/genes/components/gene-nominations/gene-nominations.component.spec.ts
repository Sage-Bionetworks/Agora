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
import { of } from 'rxjs';
import { geneMock1, teamsResponseMock } from '../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Nominations', () => {
  let fixture: ComponentFixture<GeneNominationsComponent>;
  let component: GeneNominationsComponent;
  let mockTeamService: TeamService;

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
    mockTeamService = TestBed.inject(TeamService);
    spyOn(mockTeamService, 'getTeams').and.returnValue(
      of(teamsResponseMock)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should order nominations alphabetically then by date desc', () => {
    component.gene = geneMock1;
    expect(component.nominations.length).toBeGreaterThan(0);
    expect(component.nominations[0].team).toBe('Chang Lab');
    expect(component.nominations[1].team).toBe('Emory');
    expect(component.nominations[2].team).toBe('MSSM');
    expect(component.nominations[3].team).toBe('MSSM');
    expect(component.nominations[2].initial_nomination).toBe(2020);
    expect(component.nominations[3].initial_nomination).toBe(2018);
  });
});

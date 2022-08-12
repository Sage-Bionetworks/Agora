// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { TeamService } from '.';
import { ApiService } from '../../../core/services';
import { mockTeamsResponse } from '../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Team', () => {
  let teamService: TeamService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamService, ApiService],
    });

    teamService = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(teamService).toBeDefined();
  });

  it('should get all teams', () => {
    const mockResponse = mockTeamsResponse;

    teamService.getTeams().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/teams');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // it('should get data from /api/team-member/marty-mcfly/image', () => {
  //   const mockResponse: ArrayBuffer = new ArrayBuffer(0);
  //   const mockURL = URL.createObjectURL(
  //     new Blob([new Object(mockResponse) as Blob], {
  //       type: 'image/jpg, image/png, image/jpeg',
  //     })
  //   );
  //   const teamMemberName = mockTeamMember.name
  //     .toLowerCase()
  //     .replace(/[- ]/g, '-');

  //   teamService.getTeamMemberImageUrl(teamMemberName).subscribe((response) => {
  //     expect(response).toEqual(mockURL);
  //   });

  //   const req = httpMock.expectOne(
  //     '/api/team-member/' + teamMemberName + '/image'
  //   );
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockResponse);
  // });
});

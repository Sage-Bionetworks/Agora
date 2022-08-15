// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { TeamsPageComponent } from './';
import { TeamService } from '../../../features/teams/services';
import { ApiService, HelperService } from '../../services';
import { ApiServiceStub } from '../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Page - Team', () => {
  let fixture: ComponentFixture<TeamsPageComponent>;
  let component: TeamsPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamsPageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        TeamService,
        { provide: ApiService, useValue: new ApiServiceStub() },
        HelperService,
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have teams', () => {
    const noiSpy = spyOn(component, 'ngOnInit').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
    expect(noiSpy).toHaveBeenCalled();
    expect(component.teams.length).not.toEqual(0);
    expect(element.querySelector('.team')).toBeTruthy();
  });
});

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { TeamsPageComponent } from './';
import { TeamService } from '../../../features/teams/services';
import { ApiService, HelperService } from '../../services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Page - Team', () => {
  let fixture: ComponentFixture<TeamsPageComponent>;
  let component: TeamsPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamsPageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [TeamService, ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

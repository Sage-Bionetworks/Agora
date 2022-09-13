// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { AboutPageComponent } from './';
import { SynapseApiService } from '../../services';
import { SynapseApiServiceStub } from '../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Page - About', () => {
  let fixture: ComponentFixture<AboutPageComponent>;
  let component: AboutPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutPageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: SynapseApiService, useValue: new SynapseApiServiceStub() },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have wiki component', () => {
    expect(element.querySelector('wiki')).toBeTruthy();
  });
});

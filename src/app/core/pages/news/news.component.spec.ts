// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { NewsPageComponent } from './';
import { SynapseApiService } from '../../services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Page - News', () => {
  let fixture: ComponentFixture<NewsPageComponent>;
  let component: NewsPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsPageComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [SynapseApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NewsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

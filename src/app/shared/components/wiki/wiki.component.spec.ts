// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { WikiComponent } from './';
import { SynapseApiService } from '../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Wiki', () => {
  let fixture: ComponentFixture<WikiComponent>;
  let component: WikiComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WikiComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [SynapseApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(WikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneTableComponent } from './';
import { HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Table', () => {
  let fixture: ComponentFixture<GeneTableComponent>;
  let component: GeneTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneTableComponent],
      imports: [RouterTestingModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

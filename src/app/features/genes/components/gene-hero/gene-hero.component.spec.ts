// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneHeroComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Hero', () => {
  let fixture: ComponentFixture<GeneHeroComponent>;
  let component: GeneHeroComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneHeroComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

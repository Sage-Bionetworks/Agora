// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { FooterComponent } from './';
import { routes } from '../../../app.routing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Footer', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;
  let element: HTMLElement;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo', () => {
    expect(element.querySelector('.footer-logo svg')).toBeTruthy();
  });

  it('should have navigation', () => {
    expect(element.querySelector('.footer-nav')).toBeTruthy();
  });

  it('should have site version', () => {
    const el = element.querySelector('.site-version') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.textContent).not.toEqual('');
  });

  it('should have data version', () => {
    const el = element.querySelector('.data-version') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.textContent).not.toEqual('');
    expect(el.textContent).withContext('You are trying to merge a non-production data version').toContain('syn13363290');
  });

  it('should navigate when clicking on logo', fakeAsync(() => {
    const link = element.querySelector('.footer-logo a') as HTMLElement;
    expect(link).toBeTruthy();

    router.navigate(['/about']);
    tick();
    expect(location.path()).toBe('/about');

    link?.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/');
  }));

  it('should navigate when clicking on navigation link', fakeAsync(() => {
    const path = location.path();
    const link = element.querySelector(
      '.footer-nav li:nth-child(2) > a'
    ) as HTMLElement;

    expect(link).toBeTruthy();

    link.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).not.toBe(path);
  }));
});

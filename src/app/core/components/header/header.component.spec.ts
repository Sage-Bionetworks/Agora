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
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { HeaderComponent } from './';
import { ApiService } from '../../services';
import { routes } from '../../../app.routing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Header', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let element: HTMLElement;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      providers: [ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HeaderComponent);
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
    expect(element.querySelector('.header-logo svg')).toBeTruthy();
  });

  it('should have navigation', () => {
    expect(element.querySelector('.header-nav')).toBeTruthy();
  });

  it('should have search', () => {
    expect(element.querySelector('.gene-search')).toBeTruthy();
  });

  it('should navigate when clicking on logo', fakeAsync(() => {
    const link = element.querySelector('.header-logo a') as HTMLElement;
    expect(link).toBeTruthy();

    router.navigate(['/nominated-targets']);
    tick();
    expect(location.path()).toBe('/nominated-targets');

    link?.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/');
  }));

  it('should navigate when clicking on navigation link', fakeAsync(() => {
    const path = location.path();
    const link = element.querySelector(
      '.header-nav li:first-child > a'
    ) as HTMLElement;

    expect(link).toBeTruthy();

    link.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).not.toBe(path);
  }));

  it('should toggle nav', fakeAsync(() => {
    const nav = element.querySelector('.header-nav') as HTMLElement;
    const navToggle = element.querySelector(
      '.header-nav-toggle'
    ) as HTMLElement;

    expect(nav).toBeTruthy();
    expect(navToggle).toBeTruthy();

    navToggle.click();
    tick();
    fixture.detectChanges();
    expect(nav.classList.contains('show')).toBeTruthy();
  }));
});

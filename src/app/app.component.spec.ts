// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import browserUpdate from 'browser-update';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, AppModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toEqual('Agora');
  });

  it('should have a header', () => {
    expect(element.querySelector('#header')).toBeTruthy();
  });

  it('should have a footer', () => {
    expect(element.querySelector('#footer')).toBeTruthy();
  });

  it('should initialize "browser-update"', () => {
    const oiSpy = spyOn(component, 'initBrowserUpdate');

    component.ngOnInit();
    fixture.detectChanges();
    expect(browserUpdate).toBeDefined();

    // There is no way to access properties inside BrowserUpdate scope
    // The component.buOptions gets modified when passed to browserUpdate
    expect(oiSpy).toHaveBeenCalledWith(component.buOptions);
  });
});

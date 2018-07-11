import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Load the implementations that should be tested
 */
import { AppComponent } from './app.component';
import { AppState } from './app.service';

describe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    /**
     * async beforeEach
     */
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            imports: [ RouterTestingModule ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [AppState]
        })
        /**
         * Compile template and css
         */
        .compileComponents();
    }));

    /**
     * Synchronous beforeEach
     */
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp    = fixture.componentInstance;

        /**
         * Trigger initial data binding
         */
        fixture.detectChanges();
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    it(`should be @Agora BETA`, () => {
        expect(comp.name).toEqual('Agora BETA');
    });

    it('should log ngOnInit', () => {
        spyOn(console, 'log');
        expect(console.log).not.toHaveBeenCalled();

        comp.ngOnInit();
        expect(console.log).toHaveBeenCalled();
    });
});

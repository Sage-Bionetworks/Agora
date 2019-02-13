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

import * as browserUpdate from 'browser-update';

describe(`App`, () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    /**
     * async beforeEach
     */
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            imports: [ RouterTestingModule ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [ AppState ]
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
        component = fixture.componentInstance;

        /**
         * Trigger initial data binding
         */
        fixture.detectChanges();
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });

    it(`app should be named Agora`, () => {
        expect(component.name).toEqual('Agora');
    });

    it(`should have BrowserUpdate loaded`, () => {
        const oiSpy = spyOn(component, 'initBrowserUpdate').
            withArgs(browserUpdate, component.buParams).
            and.callThrough();

        component.initBrowserUpdate(browserUpdate, component.buParams);
        fixture.detectChanges();
        // There is no way to access properties inside BrowserUpdate scope
        // The component.buParams gets modified when passed to browserUpdate
        expect(oiSpy).toHaveBeenCalledWith(browserUpdate, component.buParams);
        expect(browserUpdate).toBeDefined();
    });
});

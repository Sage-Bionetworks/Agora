import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BoxPlotsViewComponent } from './box-plots-view.component';

describe('Component: BoxPlots', () => {
    let component: BoxPlotsViewComponent;
    let fixture: ComponentFixture<BoxPlotsViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BoxPlotsViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(BoxPlotsViewComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

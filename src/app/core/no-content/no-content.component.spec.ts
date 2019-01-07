import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoContentComponent } from './no-content.component';

describe('Component: NoContent', () => {
    let component: NoContentComponent;
    let fixture: ComponentFixture<NoContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NoContentComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NoContentComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

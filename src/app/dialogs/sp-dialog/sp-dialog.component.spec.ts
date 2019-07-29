import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    DialogsServiceStub
} from '../../testing';

import { SIMilarPageDialogComponent } from './sp-dialog.component';

import { DialogsService } from '../services';

describe('Component: SPDialog', () => {
    let component: SIMilarPageDialogComponent;
    let fixture: ComponentFixture<SIMilarPageDialogComponent>;
    let dialogsService: DialogsServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SIMilarPageDialogComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: DialogsService, useValue: new DialogsServiceStub() }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SIMilarPageDialogComponent);

        // Get the injected instances
        dialogsService = fixture.debugElement.injector.get(DialogsService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

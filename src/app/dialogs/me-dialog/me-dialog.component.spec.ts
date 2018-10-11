import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    DialogsServiceStub
} from '../../testing';

import { MEDialogComponent } from './me-dialog.component';

import { DialogsService } from '../services';

import { MockComponent } from 'ng-mocks';

describe('Component: SGDialog', () => {
    let component: MEDialogComponent;
    let fixture: ComponentFixture<MEDialogComponent>;
    let dialogsService: DialogsServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MEDialogComponent,
                MockComponent(MEDialogComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: DialogsService, useValue: new DialogsServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(MEDialogComponent);

        // Get the injected instances
        dialogsService = fixture.debugElement.injector.get(DialogsService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    DialogsServiceStub,
    RouterStub,
    ActivatedRouteStub
} from '../../testing';

import { NOMinatedTargetComponent } from './nt-dialog.component';

import { DialogsService } from '../services';

import { MockComponent } from 'ng-mocks';

describe('Component: NTDialog', () => {
    let component: NOMinatedTargetComponent;
    let fixture: ComponentFixture<NOMinatedTargetComponent>;
    let router: RouterStub;
    let dialogsService: DialogsServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NOMinatedTargetComponent,
                MockComponent(NOMinatedTargetComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DialogsService, useValue: new DialogsServiceStub() }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NOMinatedTargetComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        dialogsService = fixture.debugElement.injector.get(DialogsService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import {
    DialogsServiceStub,
    RouterStub,
    ActivatedRouteStub,
    NavigationServiceStub
} from '../../testing';

import { MTDialogComponent } from './mt-dialog.component';

import { DialogsService } from '../services';
import { NavigationService } from '../../core/services';

import { Dialog } from 'primeng/dialog';

import { MockComponent } from 'ng-mocks';

describe('Component: MTDialog', () => {
    let component: MTDialogComponent;
    let fixture: ComponentFixture<MTDialogComponent>;
    let router: RouterStub;
    let dialogsService: DialogsServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MTDialogComponent,
                MockComponent(Dialog)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DialogsService, useValue: new DialogsServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MTDialogComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        dialogsService = fixture.debugElement.injector.get(DialogsService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a dialog element', () => {
        const el = fixture.debugElement.query(By.css('p-dialog'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-dialog'));
        expect(aEl.length).toEqual(1);
    });
});

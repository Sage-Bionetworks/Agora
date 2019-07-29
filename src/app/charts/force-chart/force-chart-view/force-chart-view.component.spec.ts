import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub
} from '../../../testing';

import { ForceChartViewComponent } from './force-chart-view.component';

import { GeneService } from '../../../core/services';

describe('Component: ForceChartView', () => {
    let component: ForceChartViewComponent;
    let fixture: ComponentFixture<ForceChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ForceChartViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ForceChartViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        geneService = fixture.debugElement.injector.get(GeneService);
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

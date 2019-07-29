import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    ChartServiceStub,
    NavigationServiceStub,
    GeneServiceStub
} from '../../../testing';

import { EvidenceMenuComponent } from './evidence-menu.component';

import { GeneService, NavigationService } from '../../../core/services';
import { ChartService } from '../../../charts/services';

describe('Component: EvidenceMenu', () => {
    let component: EvidenceMenuComponent;
    let fixture: ComponentFixture<EvidenceMenuComponent>;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let navService: NavigationServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EvidenceMenuComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(EvidenceMenuComponent);

        // Get the injected instances
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        navService = fixture.debugElement.injector.get(NavigationService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

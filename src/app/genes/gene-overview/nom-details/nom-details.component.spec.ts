import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    ApiServiceStub,
    NavigationServiceStub,
    GeneServiceStub,
    mockGene1,
    mockInfo1
} from '../../../testing';

import { NominationDetailsComponent } from './nom-details.component';

import { ApiService, GeneService, NavigationService } from '../../../core/services';

describe('Component: NominationDetails', () => {
    let component: NominationDetailsComponent;
    let fixture: ComponentFixture<NominationDetailsComponent>;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NominationDetailsComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NominationDetailsComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init the data', () => {
        const idSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const ltSpy = spyOn(component, 'loadTeams').and.callThrough();
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();
        const gciSpy = spyOn(geneService, 'getCurrentInfo').and.callThrough();

        component.ngOnInit();
        expect(idSpy.calls.any()).toEqual(true);
        expect(ltSpy.calls.any()).toEqual(true);
        expect(gcgSpy.calls.any()).toEqual(true);
        expect(gciSpy.calls.any()).toEqual(true);
    });

    it('should open a new window when needed', () => {
        const woSpy = spyOn(window, 'open').and.callThrough();

        component.gene = mockGene1;
        component.ntInfoArray = [mockInfo1.nominatedtarget[0]];
        component.viewNomProcess(0);

        expect(woSpy.calls.any()).toEqual(true);
        expect(woSpy.calls.count()).toEqual(1);
    });

    it('should get the title case', () => {
        const ttcSpy = spyOn(component, 'toTitleCase').and.callThrough();

        component.gene = mockGene1;
        component.ntInfoArray = [mockInfo1.nominatedtarget[0]];
        const teamTitle = component.toTitleCase(0, 'team');

        expect(ttcSpy.calls.any()).toEqual(true);
        expect(teamTitle).toEqual('Emory');
    });

    it('should get the display name', () => {
        const gfdnSpy = spyOn(component, 'getFullDisplayName').and.callThrough();

        const displayName = component.getFullDisplayName('A', 'B');

        expect(gfdnSpy.calls.any()).toEqual(true);
        expect(displayName).toEqual('A: B');
    });

    it('should get the correct team', () => {
        const ltSpy = spyOn(component, 'loadTeams').and.callThrough();

        component.ngOnInit();
        expect(ltSpy.calls.any()).toEqual(true);
        expect(component.teams[0].team).toEqual('Columbia-Rush');
    });
});

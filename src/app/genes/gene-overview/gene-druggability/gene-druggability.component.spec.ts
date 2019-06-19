import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    GeneServiceStub,
    mockInfo1
} from '../../../testing';

import { GeneDruggabilityComponent } from './gene-druggability.component';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import { GeneService } from '../../../core/services';

import { Table } from 'primeng/table';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneDruggability', () => {
    let component: GeneDruggabilityComponent;
    let fixture: ComponentFixture<GeneDruggabilityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneDruggabilityComponent,
                MockComponent(MoreInfoComponent),
                MockComponent(Table),
                MockComponent(GeneDruggabilityComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneDruggabilityComponent);

        component = fixture.componentInstance; // Component test instance

        component.geneInfo = mockInfo1;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have extra info component', () => {
        const el = fixture.debugElement.query(By.css('more-info'));
        expect(el).toBeDefined();

        // When using ng-mocks, we need to pick the component instance,
        // pass in the input value so we can assert it after
        const ci = el.componentInstance as MoreInfoComponent;
        ci.name = 'dg';
        fixture.detectChanges();
        expect(ci.name).toEqual('dg');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });

    /*it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('p-table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-table'));
        expect(aEl.length).toEqual(1);
    });

    it('should have the data initialized', () => {
        const isSpy = spyOn(component, 'initSummary').and.callThrough();
        const icSpy = spyOn(component, 'initCols').and.callThrough();

        component.initSummary();
        component.initCols();
        fixture.detectChanges();
        expect(isSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();

        expect(component.summary.length).toEqual(3);
        expect(component.cols.length).toEqual(2);
    });*/

    it('should get the correct druggability title', () => {
        const gdtSpy = spyOn(component, 'getDruggabilityTitle').and.callThrough();

        let title: string = '';
        title = component.getDruggabilityTitle(1);
        expect(title).toEqual('SM Druggable');

        title = component.getDruggabilityTitle(2);
        title = component.getDruggabilityTitle(3);
        title = component.getDruggabilityTitle(4);
        expect(title).toEqual('Targetable by Homology');

        title = component.getDruggabilityTitle(5);
        title = component.getDruggabilityTitle(6);
        expect(title).toEqual('Probably SM Druggable');

        title = component.getDruggabilityTitle(7);
        title = component.getDruggabilityTitle(8);
        title = component.getDruggabilityTitle(9);
        title = component.getDruggabilityTitle(10);
        title = component.getDruggabilityTitle(11);
        expect(title).toEqual('Potentially Targetable by Protein Family Structure');

        title = component.getDruggabilityTitle(12);
        title = component.getDruggabilityTitle(13);
        expect(title).toEqual('Potentially Low Ligandability');

        title = component.getDruggabilityTitle(14);
        expect(title).toEqual('Non-Protein Target');

        title = component.getDruggabilityTitle(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct druggability text', () => {
        const gdtSpy = spyOn(component, 'getDruggabilityText').and.callThrough();

        let title: string = '';
        title = component.getDruggabilityText(1);
        expect(title).toEqual('Protein with a SM ligand identified from' +
            ' ChEMBL, meeting TCRD activity criteria');

        title = component.getDruggabilityText(2);
        title = component.getDruggabilityText(3);
        title = component.getDruggabilityText(4);
        expect(title).toEqual('>=4-% homologous to a protein with' +
            ' a SM ligand identified from ChEMBL, meeting TCRD activity criteria');

        title = component.getDruggabilityText(5);
        title = component.getDruggabilityText(6);
        expect(title).toEqual('Protein with a SM ligand identified' +
            ' from ChEMBL data, but the ligand does not meet TCRD activity criteria');

        title = component.getDruggabilityText(7);
        title = component.getDruggabilityText(8);
        title = component.getDruggabilityText(9);
        title = component.getDruggabilityText(10);
        title = component.getDruggabilityText(11);
        expect(title).toEqual('Is a member' +
            ' of a gene family which has a protein member with a druggable pocket in' +
            ' the protein structure');

        title = component.getDruggabilityText(12);
        title = component.getDruggabilityText(13);
        expect(title).toEqual('Has a structure but there is no' +
            ' evidence of a druggable pocket');

        title = component.getDruggabilityText(14);
        expect(title).toEqual('Non-Protein Target<br>New modality indicated');

        title = component.getDruggabilityText(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct bucket style', () => {
        const gbsSpy = spyOn(component, 'getBucketStyle').and.callThrough();

        let title: string = '';
        title = component.getBucketStyle(1);
        expect(title).toEqual('#9ACCAB');
        title = component.getBucketStyle(2);
        expect(title).toEqual('#90D098');
        title = component.getBucketStyle(3);
        expect(title).toEqual('#8DD485');
        title = component.getBucketStyle(4);
        expect(title).toEqual('#98D97A');
        title = component.getBucketStyle(5);
        expect(title).toEqual('#A9DD6F');
        title = component.getBucketStyle(6);
        expect(title).toEqual('#C1E163');
        title = component.getBucketStyle(7);
        expect(title).toEqual('#E0E656');
        title = component.getBucketStyle(8);
        expect(title).toEqual('#EACD49');
        title = component.getBucketStyle(9);
        expect(title).toEqual('#EEA83C');
        title = component.getBucketStyle(10);
        expect(title).toEqual('#F37A2E');
        title = component.getBucketStyle(11);
        expect(title).toEqual('#F4884A');
        title = component.getBucketStyle(12);
        expect(title).toEqual('#E16560');
        title = component.getBucketStyle(13);
        expect(title).toEqual('#C3C7D1');
        title = component.getBucketStyle(14);
        expect(title).toEqual('#AFDDDF');

        title = component.getBucketStyle(-1);
        expect(title).toEqual('#FFFFFF');

        expect(gbsSpy).toHaveBeenCalled();
    });
});

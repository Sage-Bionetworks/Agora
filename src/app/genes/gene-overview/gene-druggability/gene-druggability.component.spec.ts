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
        expect(title).toEqual('Small molecule druggable');
        title = component.getDruggabilityTitle(2);
        expect(title).toEqual('Targetable by Homology');
        title = component.getDruggabilityTitle(3);
        expect(title).toEqual('Targetable by structure');
        title = component.getDruggabilityTitle(4);
        expect(title).toEqual('Targetable by homologous structure');
        title = component.getDruggabilityTitle(5);
        expect(title).toEqual('Probably small molecule druggable');
        title = component.getDruggabilityTitle(6);
        expect(title).toEqual('Probably small molecule druggable by homology');
        title = component.getDruggabilityTitle(7);
        expect(title).toEqual('Potentially small molecule druggable by family (active ligand)');
        title = component.getDruggabilityTitle(8);
        expect(title).toEqual(
            'Potentially small molecule druggable by family (low activity ligand)'
        );
        title = component.getDruggabilityTitle(9);
        expect(title).toEqual('Potentially targetable by protein family structure');
        title = component.getDruggabilityTitle(10);
        expect(title).toEqual('Endogenous ligand');
        title = component.getDruggabilityTitle(11);
        expect(title).toEqual('Druggable protein class, no other information');
        title = component.getDruggabilityTitle(12);
        expect(title).toEqual('Potentially low ligandability');
        title = component.getDruggabilityTitle(13);
        expect(title).toEqual('Unknown');
        title = component.getDruggabilityTitle(14);
        expect(title).toEqual('Non-protein target');

        title = component.getDruggabilityTitle(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct druggability text', () => {
        const gdtSpy = spyOn(component, 'getDruggabilityText').and.callThrough();

        let title: string = '';
        title = component.getDruggabilityText(1);
        expect(title).toEqual(
            'Protein with a small molecule ligand identified from ChEMBL, meeting ' +
                'TCRD activity criteria'
        );
        title = component.getDruggabilityText(2);
        expect(title).toEqual(
            '>=40% homologous to a protein with a small molecule ligand identified ' +
            'from ChEMBL, meeting TCRD activity criteria'
        );
        title = component.getDruggabilityText(3);
        expect(title).toEqual(
            'Structurally druggable protein, based on the presence of a druggable ' +
            'pocket in the protein (DrugEBIlity/CanSAR)'
        );
        title = component.getDruggabilityText(4);
        expect(title).toEqual(
            '>=40% homologous to a structurally druggable protein, based on the ' +
            'presence of a druggable pocket in the homologous protein (DrugEBIlity/CanSAR)'
        );
        title = component.getDruggabilityText(5);
        expect(title).toEqual(
            'Protein with a small molecule ligand identified from ChEMBL data, but ' +
                'the ligand does not meeting TCRD activity criteria'
        );
        title = component.getDruggabilityText(6);
        expect(title).toEqual(
            '>=40% homologous to a protein with a small molecule ligand identified ' +
            'from ChEMBL data, but the ligand does not meeting TCRD activity criteria'
        );
        title = component.getDruggabilityText(7);
        expect(title).toEqual(
            'Is a member of a gene family which has a member with an small molecule ' +
            'ligand identified from ChEMBL data, meeting TCRD activity criteria'
        );
        title = component.getDruggabilityText(8);
        expect(title).toEqual(
            'Is a member of a gene family which has a protein member with a ligand ' +
            'which does not meet TCRD activity criteria'
        );
        title = component.getDruggabilityText(9);
        expect(title).toEqual(
            'is a member of a gene family which has a protein member with a druggable ' +
            'pocket in the protein structure'
        );
        title = component.getDruggabilityText(10);
        expect(title).toEqual(
            'Has an identified endogenous ligand according from IUPHAR'
        );
        title = component.getDruggabilityText(11);
        expect(title).toEqual(
            'Is a member of a PHAROS druggable class of protein (enzyme, receptor, ' +
            'ion channel, nuclear hormone receptor, kinase) but does not meet any of the ' +
            'criteria above'
        );
        title = component.getDruggabilityText(12);
        expect(title).toEqual(
            'Has a structure but there is no evidence of a druggable pocket'
        );
        title = component.getDruggabilityText(13);
        expect(title).toEqual(
            'There is no information on ligands or structure in any of the categories ' +
            'above'
        );
        title = component.getDruggabilityText(14);
        expect(title).toEqual('New modality indicated');

        title = component.getDruggabilityText(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct bucket style', () => {
        const gbsSpy = spyOn(component, 'getBucketStyle').and.callThrough();

        let title: string = '';
        title = component.getBucketStyle(1);
        expect(title).toEqual('#20A386');
        title = component.getBucketStyle(2);
        expect(title).toEqual('#1F968B');
        title = component.getBucketStyle(3);
        expect(title).toEqual('#238A8D');
        title = component.getBucketStyle(4);
        expect(title).toEqual('#277D8E');
        title = component.getBucketStyle(5);
        expect(title).toEqual('#2D708E');
        title = component.getBucketStyle(6);
        expect(title).toEqual('#32648E');
        title = component.getBucketStyle(7);
        expect(title).toEqual('#39558C');
        title = component.getBucketStyle(8);
        expect(title).toEqual('#3F4788');
        title = component.getBucketStyle(9);
        expect(title).toEqual('#453781');
        title = component.getBucketStyle(10);
        expect(title).toEqual('#482677');
        title = component.getBucketStyle(11);
        expect(title).toEqual('#481568');
        title = component.getBucketStyle(12);
        expect(title).toEqual('#440D54');
        title = component.getBucketStyle(13);
        expect(title).toEqual('#C3C7D1');
        title = component.getBucketStyle(14);
        expect(title).toEqual('#AFDDDF');

        title = component.getBucketStyle(-1);
        expect(title).toEqual('#FFFFFF');

        expect(gbsSpy).toHaveBeenCalled();
    });
});

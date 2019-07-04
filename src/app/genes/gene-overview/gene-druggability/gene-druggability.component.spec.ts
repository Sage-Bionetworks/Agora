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

import * as d3 from 'd3';

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
        const gdtSpy = spyOn(component, 'getDruggabilitySMTitle').and.callThrough();

        let title: string = '';
        title = component.getDruggabilitySMTitle(1);
        expect(title).toEqual('Small molecule druggable');
        title = component.getDruggabilitySMTitle(2);
        expect(title).toEqual('Targetable by Homology');
        title = component.getDruggabilitySMTitle(3);
        expect(title).toEqual('Targetable by structure');
        title = component.getDruggabilitySMTitle(4);
        expect(title).toEqual('Targetable by homologous structure');
        title = component.getDruggabilitySMTitle(5);
        expect(title).toEqual('Probably small molecule druggable');
        title = component.getDruggabilitySMTitle(6);
        expect(title).toEqual('Probably small molecule druggable by homology');
        title = component.getDruggabilitySMTitle(7);
        expect(title).toEqual('Potentially small molecule druggable by family (active ligand)');
        title = component.getDruggabilitySMTitle(8);
        expect(title).toEqual(
            'Potentially small molecule druggable by family (low activity ligand)'
        );
        title = component.getDruggabilitySMTitle(9);
        expect(title).toEqual('Potentially targetable by protein family structure');
        title = component.getDruggabilitySMTitle(10);
        expect(title).toEqual('Endogenous ligand');
        title = component.getDruggabilitySMTitle(11);
        expect(title).toEqual('Druggable protein class, no other information');
        title = component.getDruggabilitySMTitle(12);
        expect(title).toEqual('Potentially low ligandability');
        title = component.getDruggabilitySMTitle(13);
        expect(title).toEqual('Unknown');
        title = component.getDruggabilitySMTitle(14);
        expect(title).toEqual('Non-protein target');

        title = component.getDruggabilitySMTitle(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct druggability text', () => {
        const gdtSpy = spyOn(component, 'getDruggabilitySMText').and.callThrough();

        let title: string = '';
        title = component.getDruggabilitySMText(1);
        expect(title).toEqual(
            'Protein with a small molecule ligand identified from ChEMBL, meeting ' +
                'TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(2);
        expect(title).toEqual(
            '>=40% homologous to a protein with a small molecule ligand identified ' +
            'from ChEMBL, meeting TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(3);
        expect(title).toEqual(
            'Structurally druggable protein, based on the presence of a druggable ' +
            'pocket in the protein (DrugEBIlity/CanSAR)'
        );
        title = component.getDruggabilitySMText(4);
        expect(title).toEqual(
            '>=40% homologous to a structurally druggable protein, based on the ' +
            'presence of a druggable pocket in the homologous protein (DrugEBIlity/CanSAR)'
        );
        title = component.getDruggabilitySMText(5);
        expect(title).toEqual(
            'Protein with a small molecule ligand identified from ChEMBL data, but ' +
                'the ligand does not meeting TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(6);
        expect(title).toEqual(
            '>=40% homologous to a protein with a small molecule ligand identified ' +
            'from ChEMBL data, but the ligand does not meeting TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(7);
        expect(title).toEqual(
            'Is a member of a gene family which has a member with an small molecule ' +
            'ligand identified from ChEMBL data, meeting TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(8);
        expect(title).toEqual(
            'Is a member of a gene family which has a protein member with a ligand ' +
            'which does not meet TCRD activity criteria'
        );
        title = component.getDruggabilitySMText(9);
        expect(title).toEqual(
            'is a member of a gene family which has a protein member with a druggable ' +
            'pocket in the protein structure'
        );
        title = component.getDruggabilitySMText(10);
        expect(title).toEqual(
            'Has an identified endogenous ligand according from IUPHAR'
        );
        title = component.getDruggabilitySMText(11);
        expect(title).toEqual(
            'Is a member of a PHAROS druggable class of protein (enzyme, receptor, ' +
            'ion channel, nuclear hormone receptor, kinase) but does not meet any of the ' +
            'criteria above'
        );
        title = component.getDruggabilitySMText(12);
        expect(title).toEqual(
            'Has a structure but there is no evidence of a druggable pocket'
        );
        title = component.getDruggabilitySMText(13);
        expect(title).toEqual(
            'There is no information on ligands or structure in any of the categories ' +
            'above'
        );
        title = component.getDruggabilitySMText(14);
        expect(title).toEqual('New modality indicated');

        title = component.getDruggabilitySMText(-1);
        expect(title).toEqual('');

        expect(gdtSpy).toHaveBeenCalled();
    });

    it('should get the correct bucket style', () => {
        const gbsSpy = spyOn(component, 'getBucketBGColor').and.callThrough();
        const i = d3.interpolateRgb('#20A386', '#440D54');

        let title: string = '';
        title = component.getBucketBGColor(1, 'sm');
        expect(title).toEqual(d3.hcl(i(1 / 12)).hex());

        title = component.getBucketBGColor(2, 'ab');
        expect(title).toEqual(d3.hcl(i(2 / 6)).hex());

        title = component.getBucketBGColor(3, 'sf');
        expect(title).toEqual(d3.hcl(i(3 / 5)).hex());

        title = component.getBucketBGColor(13, 'sm');
        expect(title).toEqual('#C3C7D1');

        title = component.getBucketBGColor(14, 'sm');
        expect(title).toEqual('#AFDDDF');

        title = component.getBucketBGColor(-1, 'sm');
        expect(title).toEqual('#FFFFFF');

        expect(gbsSpy).toHaveBeenCalled();
    });
});

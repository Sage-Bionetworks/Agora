import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    GeneServiceStub
} from '../../../../testing';

import { RNAComponent } from './rna.component';
import { MoreInfoComponent } from '../../../../dialogs/more-info';

import { GeneService } from '../../../../core/services';

import { MockComponent } from 'ng-mocks';

describe('Component: RNA', () => {
    let component: RNAComponent;
    let fixture: ComponentFixture<RNAComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent(MoreInfoComponent),
                RNAComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(RNAComponent);

        component = fixture.componentInstance; // Component test instance
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
        ci.name = 'rna';
        fixture.detectChanges();
        expect(ci.name).toEqual('rna');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });

    it('should have the rna dialog element', () => {
        const el = fixture.debugElement.query(By.css('rna-dialog'));
        expect(el.properties.header).toEqual('RNA Expression Analysis');
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('rna-dialog'));
        expect(aEl.length).toEqual(1);
    });

    it('should get the no info data state', () => {
        const gisSpy = spyOn(component, 'getNoInfoState').and.callThrough();
        const infoState: boolean = component.getNoInfoState();
        expect(gisSpy.calls.any()).toEqual(true);
        expect(infoState).toEqual(false);
    });
});

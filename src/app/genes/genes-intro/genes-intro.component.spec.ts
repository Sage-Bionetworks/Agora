import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
    LocalStorageServiceStub
} from '../../testing';

import { GenesIntroComponent } from './genes-intro.component';
import { GeneSearchComponent } from '../gene-search';

import { Button } from 'primeng/button';

import { MockComponent } from 'ng-mocks';
import { NgxWebstorageModule, LocalStorageService } from 'ngx-webstorage';

import { of } from 'rxjs';

describe('Component: GenesIntro', () => {
    let component: GenesIntroComponent;
    let fixture: ComponentFixture<GenesIntroComponent>;
    let lstService: LocalStorageServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxWebstorageModule.forRoot()
            ],
            declarations: [
                MockComponent(Button),
                MockComponent(GeneSearchComponent),
                GenesIntroComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: LocalStorageService, useValue: new LocalStorageServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesIntroComponent);

        // Get the injected instances
        lstService = fixture.debugElement.injector.get(LocalStorageService);

        component = fixture.componentInstance; // Component test instance

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show or hide the intro video depending on user visitation', fakeAsync(() => {
        const rSpy = spyOn(lstService, 'retrieve').and.callThrough();
        const sSpy = spyOn(lstService, 'store').and.callThrough();
        const oSpy = spyOn(lstService, 'observe').and.callFake(() => {
            return of(true);
        });
        lstService.store('hasVisited', true);

        spyOn(component, 'ngOnInit').and.callThrough();
        lstService.observe('showVideo');
        component.ngOnInit(); // trigger click on Watch the Video button
        tick();
        fixture.detectChanges();
        expect(lstService.retrieve('hasVisited')).toEqual(true);
        expect(component.showVideo).toEqual(true);

        // Second visit test
        rSpy.and.callFake((key: string) => {
            if (key === 'hasVisited') {
                return true;
            }
            return false;
        });
        oSpy.and.callFake(() => {
            return of(false);
        });
        lstService.observe('showVideo');
        component.ngOnInit(); // trigger click on Watch the Video button
        tick();
        fixture.detectChanges();
        expect(rSpy.calls.any()).toEqual(true);
        expect(sSpy.calls.any()).toEqual(true);
        expect(oSpy.calls.any()).toEqual(true);
        expect(lstService.retrieve('hasVisited')).toEqual(true);
        expect(component.showVideo).toEqual(false);
    }));

    it('should show and hide video properly', () => {
        component.showVideo = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const el = fixture.debugElement.query(By.css('iframe'));
            expect(el).toBeDefined();
        });

        component.showVideo = false;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const el = fixture.debugElement.query(By.css('img'));
            expect(el).toBeDefined();
        });
    });

    it('should have search as child component', () => {
        const gsElement = fixture.debugElement
            .query(By.css('gene-search'))
            .componentInstance as GeneSearchComponent;

        expect(gsElement).toBeTruthy();
    });

    it('should show the dialog', () => {
        component.showDialog();
        fixture.detectChanges();

        expect(component.display).toBeTruthy();
    });

    it('should play the video', () => {
        component.playVideo();
        fixture.detectChanges();

        expect(component.showVideo).toBeTruthy();
    });
});

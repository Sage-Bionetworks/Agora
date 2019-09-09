import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

import {
    LocalStorageServiceStub,
    RouterStub,
    DataServiceStub,
    GeneServiceStub,
    NavigationServiceStub
} from '../../testing';

import { DataService, GeneService, NavigationService } from '../services';

import { MockComponent } from 'ng-mocks';
import { NgxWebstorageModule, LocalStorageService } from 'ngx-webstorage';

import { SplitButton } from 'primeng/splitbutton';
import { TabMenu } from 'primeng/tabmenu';

describe('Component: Navbar', () => {
    let component: NavbarComponent;
    let navService: NavigationServiceStub;
    let fixture: ComponentFixture<NavbarComponent>;
    let lstService: LocalStorageServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxWebstorageModule.forRoot()
            ],
            declarations: [
                NavbarComponent,
                MockComponent(TabMenu),
                MockComponent(SplitButton)
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                { provide: LocalStorageService, useValue: new LocalStorageServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        navService = fixture.debugElement.injector.get(NavigationService);
        lstService = fixture.debugElement.injector.get(LocalStorageService);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a logo img', fakeAsync(() => {
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('img'));
        expect(el).not.toBeNull();
    }));

    it('should have a desktop menu', fakeAsync(() => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).not.toBeNull();
    }));

    it('should have a mobile menu', () => {
        component.showDesktopMenu = false;
        component.showMobileMenu = true;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-splitButton'));
        expect(el).not.toBeNull();
    });

    it('should not have a Watch the Video button', () => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-button'));
        expect(el).toBeNull();
    });

    it('should have the correct number of items in each menu', () => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const el = fixture.debugElement.query(By.css('p-tabMenu'));
            expect(el.nativeElement.model.length).toEqual(3);
        });

        component.showDesktopMenu = false;
        component.showMobileMenu = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const mEl = fixture.debugElement.query(By.css('p-splitButton'));
            expect(mEl.nativeElement.model.length).toEqual(6);
        });
    });

    it('should tell ROUTER to navigate home when selecting logo img', fakeAsync(() => {
        const spy = spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.goHome();
        tick();
        fixture.detectChanges();
        expect(spy.calls.any()).toEqual(true);

        // The router stub uses 'commands' and 'navigation extras' as parameters.
        // Commands is an array with the 'path' and 'outlets', and the navigation
        // extras is another object with extra configuration parameters.
        // Here we pass /genes and undefined values accordingly
        expect(navService.testRouter.navigate).toHaveBeenCalledWith(
            [
                '/genes', undefined
            ],
            undefined
        );
    }));

    it('should not change route if no path is provided', fakeAsync(() => {
        const spy = spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.changeRoute('');
        tick();
        fixture.detectChanges();
        expect(spy.calls.any()).toEqual(false);

        expect(navService.testRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should change route if a new path provided', fakeAsync(() => {
        const spy = spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.changeRoute('Gene Search');
        tick();
        fixture.detectChanges();
        expect(spy.calls.any()).toEqual(true);
        expect(spy.calls.count()).toBe(1);

        expect(navService.testRouter.navigate).toHaveBeenCalledWith(
            [
                'genes', undefined
            ],
            undefined
        );

        component.changeRoute('Nominated Targets');
        tick();
        fixture.detectChanges();
        expect(spy.calls.count()).toBe(2);

        // Second route
        expect(navService.testRouter.navigate).toHaveBeenCalledWith(
            [
                '/genes', {
                    outlets: {
                        'genes-router': [ 'genes-list' ],
                        'gene-overview': null,
                        'evidence-menu': null
                    }
                }
            ],
            undefined
        );

        component.changeRoute('Teams');
        tick();
        fixture.detectChanges();
        expect(spy.calls.count()).toBe(3);

        // Third route
        expect(navService.testRouter.navigate).toHaveBeenCalledWith(
            [
                'teams-contributing', undefined
            ],
            undefined
        );
    }));

    it('should show the video if it\'s current state is falsy', fakeAsync(() => {
        const rSpy = spyOn(lstService, 'retrieve').and.callThrough();
        const sSpy = spyOn(lstService, 'store').and.callThrough();

        spyOn(component, 'showVideo').and.callThrough();
        component.showVideo(); // trigger click on Watch the Video button
        tick();
        fixture.detectChanges();
        expect(rSpy.calls.any()).toEqual(true);
        expect(sSpy.calls.any()).toEqual(true);
        expect(lstService.retrieve('showVideo')).toEqual(true);
    }));

    it('should change the show video state if we already a valid', fakeAsync(() => {
        const rSpy = spyOn(lstService, 'retrieve').and.callThrough();
        const sSpy = spyOn(lstService, 'store').and.callThrough();
        lstService.store('showVideo', false);

        spyOn(component, 'showVideo').and.callThrough();
        component.showVideo(); // trigger click on Watch the Video button
        tick();
        fixture.detectChanges();
        expect(rSpy.calls.any()).toEqual(true);
        expect(sSpy.calls.any()).toEqual(true);
        expect(lstService.retrieve('showVideo')).toEqual(false);
    }));

    it('update the menu variables depending on window size', fakeAsync(() => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        let width = 1200;
        const rSpy = spyOn(component, 'updateVars').and.callThrough();
        const wSpy = spyOnProperty(window, 'innerWidth').and.returnValue(width);

        component.updateVars();
        tick();
        fixture.detectChanges();
        expect(window.innerWidth).toEqual(width);
        expect(component.showMobileMenu).toEqual(false);
        expect(component.showDesktopMenu).toEqual(true);

        width = 500;
        wSpy.and.returnValue(width);

        tick();
        fixture.detectChanges();
        expect(window.innerWidth).toEqual(width);
        component.updateVars();
        tick();
        fixture.detectChanges();
        expect(component.showMobileMenu).toEqual(true);
        expect(component.showDesktopMenu).toEqual(false);

        expect(wSpy.calls.any()).toEqual(true);
        expect(rSpy.calls.any()).toEqual(true);
    }));
});

import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

import {
    RouterStub,
    DataServiceStub,
    GeneServiceStub,
    NavigationServiceStub
} from '../../testing';

import { DataService, GeneService, NavigationService } from '../services';

import { MockComponent } from 'ng-mocks';

import { SplitButton } from 'primeng/splitbutton';
import { TabMenu } from 'primeng/tabmenu';

describe('Component: Navbar', () => {
    let component: NavbarComponent;
    let navService: NavigationServiceStub;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        navService = fixture.debugElement.injector.get(NavigationService);
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

        component.goHome(); // trigger click on row
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
                        'gene-overview': null
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
});

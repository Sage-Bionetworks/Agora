import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import {
    RouterStub
} from '../../../app/testing';

import { GenesIntroComponent } from './genes-intro.component';
import { GeneSearchComponent } from '../gene-search';

import { Button } from 'primeng/button';

import { MockComponent } from 'ng-mocks';

describe('Component: GenesIntro', () => {
    let component: GenesIntroComponent;
    let fixture: ComponentFixture<GenesIntroComponent>;
    let router: RouterStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenesIntroComponent,
                MockComponent(Button),
                MockComponent(GeneSearchComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesIntroComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have search as child component', () => {
        const gsElement = fixture.debugElement
            .query(By.css('gene-search'))
            .componentInstance as GeneSearchComponent;

        expect(gsElement).toBeTruthy();
    });

    it('should tell that the list button was clicked', fakeAsync(() => {
        const gtrSpy = spyOn(component, 'goToRoute');
        const buttons = fixture.debugElement.nativeElement.querySelectorAll('p-button');
        expect(buttons.length).toBe(2);

        const pButton = fixture.debugElement.query(By.css('p-button'));
        const pButtonElem = pButton.nativeElement;
        const leftclickevent = new MouseEvent('click', {button: 0});
        pButtonElem.dispatchEvent(leftclickevent);
        tick();
        fixture.detectChanges();
        expect(gtrSpy.calls.any()).toEqual(true);
    }));

    it('should tell ROUTER to navigate to genes list', fakeAsync(() => {
        spyOn(router, 'navigate'); // .and.callThrough();

        component.goToRoute('/genes', { outlets: {'genes-router': [ 'genes-list' ] }});
        fixture.detectChanges();

        // Expecting to navigate to genes list
        expect(router.navigate).toHaveBeenCalledWith([
            '/genes',
            { outlets: {'genes-router': [ 'genes-list' ] }}
        ]);
    }));
});

import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { DownloadComponent } from './';

import { MockComponent } from 'ng-mocks';

import { OverlayPanel } from 'primeng/overlaypanel';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';

describe('Component: Download', () => {
    let component: DownloadComponent;
    let fixture: ComponentFixture<DownloadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OverlayPanel,
                MockComponent(Button),
                MockComponent(Checkbox),
                DownloadComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                BrowserAnimationsModule
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(DownloadComponent);

        component = fixture.componentInstance; // Component test instance
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have image types', () => {
        expect(component.types.length).not.toEqual(0);
    });

    it('should have visible overlay menu after load', fakeAsync(() => {
        const img = fixture.debugElement.nativeElement.querySelector('img');
        img.click();
        fixture.detectChanges();

        expect(component.overlayPanel.visible).toEqual(true);
    }));

    it('should hide the overlay menu', fakeAsync(() => {
        const img = fixture.debugElement.nativeElement.querySelector('img');
        img.click();
        fixture.detectChanges();

        component.overlayPanel.hide();
        fixture.detectChanges();

        expect(component.overlayPanel.visible).toEqual(false);
    }));

    it('should have an img element', () => {
        const el = fixture.debugElement.query(By.css('img'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('img'));
        expect(aEl.length).toEqual(1);
    });

    it('should have a dialog element', () => {
        const el = fixture.debugElement.query(By.css('p-dialog'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-dialog'));
        expect(aEl.length).toEqual(1);
    });

    it('should have an overlay panel', () => {
        const el = fixture.debugElement.query(By.css('p-overlayPanel'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-overlayPanel'));
        expect(aEl.length).toEqual(1);
    });

    it('should have checkboxes for all types', () => {
        component.types = [
            {
                value: 'png',
                label: 'PNG'
            }
        ];
        const img = fixture.debugElement.nativeElement.querySelector('img');
        img.click();
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-checkbox'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-checkbox'));
        expect(aEl.length).toEqual(1);
    });
});

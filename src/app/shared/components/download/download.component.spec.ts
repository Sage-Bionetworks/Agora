import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DownloadComponent } from './';

import { OverlayPanelModule } from 'primeng/overlaypanel';

describe('Component: Download', () => {
    let component: DownloadComponent;
    let fixture: ComponentFixture<DownloadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                OverlayPanelModule
            ],
            declarations: [
                DownloadComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(DownloadComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have image types', () => {
        expect(component.types.length).not.toEqual(0);
    });

    it('should hide the overlay menu', fakeAsync(() => {
        fixture.detectChanges();
        tick(1);
        spyOn(component, 'hide').and.callThrough();
        fixture.detectChanges();

        expect(component.overlayPanel.visible).toEqual(false);
    }));
});

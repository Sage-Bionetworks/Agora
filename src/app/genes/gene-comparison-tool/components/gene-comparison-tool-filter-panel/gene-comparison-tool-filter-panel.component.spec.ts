import {
    async,
    fakeAsync,
    ComponentFixture,
    TestBed,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';

import { GeneComparisonToolFilterPanelComponent } from '.';

import { GCTFilter } from '../..';

const mockFilters: GCTFilter[] = [
    {
        name: 'test',
        label: 'Test',
        options: [
            {label: '1', value: 1, selected: false},
            {label: '2', value: 1, selected: false},
            {label: '3', value: 3, selected: false},
        ]
    },
];

fdescribe('Component: GeneComparisonToolFilterPanelComponent', () => {
    let component: GeneComparisonToolFilterPanelComponent;
    let fixture: ComponentFixture<GeneComparisonToolFilterPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneComparisonToolFilterPanelComponent,
                Checkbox
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: []
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneComparisonToolFilterPanelComponent);
        component = fixture.componentInstance; // Component test instance
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should have close button', () => {
        const closeButton = fixture.debugElement.queryAll(By.css('.gct-filter-panel-close'));
        expect(closeButton).toBeDefined();
        expect(closeButton.length).toEqual(1);
    });

    it('should load filters', fakeAsync(() => {
        // Add mock data
        component.filters = mockFilters;

        fixture.detectChanges();
        tick();

        // Check if html elements have been created
        const panes = fixture.debugElement.nativeElement.querySelectorAll('.gct-filter-panel-pane');
        expect(panes?.length).toEqual(mockFilters.length);
        const options = fixture.debugElement.nativeElement.querySelectorAll('.gct-filter-panel-pane:first-child li');
        expect(options?.length).toEqual(mockFilters[0].options.length);
    }));

    it('should open', fakeAsync(() => {
        // Set to close
        component.isOpen = false;

        // Open programmatically
        component.open();
        expect(component.isOpen).toEqual(true);

        fixture.detectChanges();
        tick();

        // Make sure panel is open
        const panel = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel');
        expect(panel?.classList?.contains('open')).toEqual(true);
    }));

    it('should close', fakeAsync(() => {
        // Set to open
        component.isOpen = true;

        // Close programmatically
        component.close();
        expect(component.isOpen).toEqual(false);

        // Set to open
        component.isOpen = true;

        fixture.detectChanges();
        tick();

        // Close with click event
        const closeButton = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel-close');
        closeButton.click();
        expect(component.isOpen).toEqual(false);

        fixture.detectChanges();
        tick();

        // Make sure panel is close
        const panel = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel');
        expect(panel?.classList?.contains('open')).toEqual(false);
    }));

    it('should toggle', fakeAsync(() => {
        // Set to open
        component.isOpen = true;

        // Toggle (close) programmatically
        component.toggle();
        expect(component.isOpen).toEqual(false);

        fixture.detectChanges();
        tick();

        // Make sure panel is close
        const panel = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel');
        expect(panel?.classList?.contains('open')).toEqual(false);
    }));

    it('should open pane', fakeAsync(() => {
        // Add mock data
        component.filters = mockFilters;

        // Set to all close
        component.activePane = -1;

        // Open first pane programmatically
        component.openPane(0);
        expect(component.activePane).toEqual(0);

        fixture.detectChanges();
        tick();

        // Make sure first pane is open
        const pane = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel-pane:first-child');
        expect(pane?.classList?.contains('open')).toEqual(true);
    }));

    it('should close pane', fakeAsync(() => {
        // Add mock data
        component.filters = mockFilters;

        /// Set to first pane
        component.activePane = 0;

        // Open first pane programmatically
        component.closePanes();
        expect(component.activePane).toEqual(-1);

        fixture.detectChanges();
        tick();

        // Make sure first pane is open
        const pane = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel-pane:first-child');
        expect(pane?.classList?.contains('open')).toEqual(false);
    }));

    it('should toggle option', fakeAsync(() => {
        // Add mock data
        component.filters = mockFilters;

        fixture.detectChanges();
        tick();

        // Toggle (check) first option with click event
        const checkbox = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel-pane:first-child li:first-child .p-checkbox-box');
        checkbox.click();

        fixture.detectChanges();
        tick();

        // Make sure input reflects changes
        const input = fixture.nativeElement.querySelector('.gct-filter-panel-pane:first-child li:first-child input');
        expect(input.checked).toBe(true);
    }));
});

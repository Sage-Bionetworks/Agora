import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoadingComponent } from './';

describe('Component: Loading', () => {
    let component: LoadingComponent;
    let fixture: ComponentFixture<LoadingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoadingComponent
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(LoadingComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the spinner HTML elements', () => {
        const loaderEl = fixture.debugElement.query(By.css('.loader'));
        expect(loaderEl).toBeDefined();

        const spinnerEl = fixture.debugElement.query(By.css('.spinner'));
        expect(spinnerEl).toBeDefined();

        const containerEl = fixture.debugElement.query(By.css('.spinner-container'));
        expect(containerEl).toBeDefined();

        const loaderElArray = fixture.debugElement.queryAll(By.css('.loader'));
        expect(loaderElArray.length).toEqual(1);

        const spinnerElArray = fixture.debugElement.queryAll(By.css('.spinner'));
        expect(spinnerElArray.length).toEqual(3);

        const containerElArray = fixture.debugElement.queryAll(By.css('.spinner-container'));
        expect(containerElArray.length).toEqual(3);
    });
});

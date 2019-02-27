import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './';

describe('Component: Footer', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AboutComponent
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

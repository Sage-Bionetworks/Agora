import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationServiceStub } from '../../testing';

import { AboutComponent } from './';

import { NavigationService } from '../../core/services';

describe('Component: Footer', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AboutComponent
            ],
            providers: [
                { provide: NavigationService, useValue: new NavigationServiceStub() }
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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../core-routing.module';

import { AboutComponent } from '../about/about.component';
import { NoContentComponent } from '../no-content/no-content.component';
import { NavbarComponent } from './navbar.component';
import { ContribTeamsPageComponent } from '../contrib-teams';
import { SynapseAccountComponent } from '../synapse-account';
import { TermsComponent } from '../terms';
import { HelpComponent } from '../help';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes)
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                AboutComponent,
                HelpComponent,
                TermsComponent,
                ContribTeamsPageComponent,
                SynapseAccountComponent,
                NoContentComponent,
                NavbarComponent
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/primeng';

//import { UserService } from '../shared/_services';

// Dummy user for now
import { User } from '../_models';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
    @ViewChild('micon') menuIcon: ElementRef;

    //user: User;
    popupItems: MenuItem[];

    items: MenuItem[];

    constructor(
        //private users: UserService,
        private router: Router
    ) { }

    ngOnInit() {
        this.items = [
            {
                label: '',
                icon: 'my-icon',
                items: [
                    {
                        label: 'Your Profile'
                    },
                    {
                        label: 'Settings',
                        icon: 'fa-cog'
                    },
                    {
                        label: 'Log Out',
                        icon: 'fa-sign-out'
                    }
                ]
            }
        ];
    }

    goHome() {
        this.router.navigate(['/']);
    }

    closeMenu(event: any) {
        this.menuIcon.nativeElement.classList.toggle('active');
    }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
    //user: User;

    items: MenuItem[];

    constructor(
        //private users: UserService,
        private router: Router
    ) { }

    ngOnInit() {
        // Returns a user by default
        //this.user = this.users.getUser();
        this.items= [{label:'Logout'}];

    }

    goHome() {
        this.router.navigate(['/']);
    }
}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(username: string, password: string) {
        return this.http
            .post('/api/authenticate', JSON.stringify({ username, password }))
            .pipe(
                map((response: Response) => {
                    // Login successful if there's a jwt token in the response
                    const user = response.json();
                    if (user && user.token) {
                        // Store user details and jwt token in local storage to keep
                        // user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}

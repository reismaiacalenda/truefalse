import { Injectable } from "@angular/core";
import { Response, Http } from "@angular/http";
import "rxjs/add/operator/map";
import { HttpClient } from '@angular/common/http';
import { consoleLog } from '../../globals';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) {
    }

    login(email: string, code: string) {
        let user = {
            email: email,
            code: code

        }
        consoleLog("Montagem do user em authentication.service.login:");
        consoleLog(user);
        consoleLog("salvando user no localStorage");
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    loginB(email: string, password: string) {
        return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }



    logout() {
        // remove user from local storage to log user out
        consoleLog("authetnication.service.logout removendo user do localStorage");
        localStorage.removeItem('currentUser');
    }
}

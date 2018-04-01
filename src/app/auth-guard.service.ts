import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import {AuthService} from './shared/auth/auth.service';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        const rgxpStudent = /^\/student.*/g;
        const rgxpAdmin = /^\/admin.*/g;


        const authStatusUrl = 'http://vps9615.hyperhost.name:443/api/login/isLogged';
        let authStatus: any = {
            response: undefined,
            roles: [undefined]
        };

        let promise = new Promise((resolve, reject) => {
                this.http.get(authStatusUrl)
                    .subscribe((data) => {
                        authStatus = data;
                        if (authStatus.response === 'logged') {
                                if (authStatus.roles[1] === 'student') {
                                    resolve('student');
                                } else { if (authStatus.roles[1] === 'admin') {
                                    resolve('admin'); }
                                }
                            } else {resolve ('non logged'); }
                        }
                    );
            }
        );


    return promise.then(
        result => {
            if (result === 'student' && rgxpStudent.test(url)) {
                console.log('student');
                return true;
            } else {
                if (result === 'admin' && rgxpAdmin.test(url)) {
                    console.log('admin');
                    return true;
                } else {
                        console.log('non propriate page due to rights');
                        this.router.navigate(['/login']);
                        this.authService.redirectUrl = url;
                        return false;
                    }
                }
            },
            result => {
            if (result === 'non logged') {
                console.log('login');
                this.router.navigate(['/login']);
                this.authService.redirectUrl = url;
                return false;
            }
        }
    );
    }
}

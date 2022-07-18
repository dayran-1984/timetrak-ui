import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';
import { environment } from '../../environments/environment.prod';
import { AuthenticationService } from './authentication.service';



@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/GetAll`);
    }

    getCurrentUser(){
        const currentUser = this.authenticationService.currentUserValue;
        return `${currentUser.firstName} ${currentUser.lastName}`;
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../core/services/config.service";
import { UserParams } from "../../../core/models/filterParams.model";
import { Observable } from "rxjs";
import { UserData, UserEdit } from "../../../core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    
    constructor(private http: HttpClient, private configService: ConfigService) { }

    /**
     * Fetches users based on the provided parameters.
     * @param userParams - Parameters to filter users.
     * @returns An observable containing user data.
     */

    getUsers(userParams: UserParams): Observable<UserData> {
        let url: string = `${this.configService.getApiUrl()}/users`;
        if (userParams.page && userParams.size) {
            url = `${url}?page=${userParams.page}&size=${userParams.size}`;
        }
        if (userParams.email) {
            url = `${url}&email=${userParams.email}`;
        }
        if (userParams.role) {
            url = `${url}&role=${userParams.role}`;
        }
        if (userParams.isApproved !== undefined) {
            url = `${url}&isApproved=${userParams.isApproved}`;
        }
        if (userParams.createdAt) {
            url = `${url}&createdAt=${userParams.createdAt.toISOString()}`;
        }
        if (userParams.updatedAt) {
            url = `${url}&updatedAt=${userParams.updatedAt.toISOString()}`;
        }
        return this.http.get<UserData>(url, { withCredentials: true });
    }

    createUser(user: UserEdit): Observable<UserData> {
        const url = `${this.configService.getApiUrl()}/users`;
        return this.http.post<UserData>(url, user, { withCredentials: true });
    }

    editUser(user: UserEdit): Observable<UserData> {
        const url = `${this.configService.getApiUrl()}/users`;
        return this.http.put<any>(url, user, { withCredentials: true });
    }

    deleteUser(id: string): Observable<{message: string}> {
        const url = `${this.configService.getApiUrl()}/users/${id}`;
        return this.http.delete<{message: string}>(url, { withCredentials: true });
    }
}
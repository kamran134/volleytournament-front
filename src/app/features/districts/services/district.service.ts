import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { District } from '../../../models/district.model';
import { ConfigService } from '../../../services/config.service';
import { ResponseFromBackend } from '../../../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class DistrictService {
    constructor(private http: HttpClient, private configService: ConfigService) {}

    getDistricts(): Observable<District[]> {
        const url: string = `${this.configService.getApiUrl()}/districts`;
        return this.http.get<District[]>(url);
    }

    addDistrict(district: {name: string, code: number}): Observable<ResponseFromBackend> {
        const url: string = `${this.configService.getApiUrl()}/districts`;
        return this.http.post<ResponseFromBackend>(url, district);
    }
}

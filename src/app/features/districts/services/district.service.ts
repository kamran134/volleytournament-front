import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { District, DistrictData } from '../../../models/district.model';
import { ConfigService } from '../../../services/config.service';
import { ResponseFromBackend } from '../../../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class DistrictService {
    constructor(private http: HttpClient, private configService: ConfigService) {}

    getDistricts(): Observable<DistrictData> {
        const url: string = `${this.configService.getApiUrl()}/districts`;
        return this.http.get<DistrictData>(url);
    }

    addDistrict(district: {name: string, code: number}): Observable<ResponseFromBackend> {
        const url: string = `${this.configService.getApiUrl()}/districts`;
        return this.http.post<ResponseFromBackend>(url, district, { withCredentials: true });
    }

    deleteDistrict(districtId: string): Observable<ResponseFromBackend> {
        const url: string = `${this.configService.getApiUrl()}/districts/${districtId}`;
        return this.http.delete<ResponseFromBackend>(url, { withCredentials: true });
    }
}

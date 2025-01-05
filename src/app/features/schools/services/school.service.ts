import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { SchoolData } from '../../../models/school.model';
import { FilterParams } from '../../../models/filterParams.model';

@Injectable({
    providedIn: 'root'
})
export class SchoolService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    getSchools(params: FilterParams): Observable<SchoolData> {
        let url: string = `${this.configService.getApiUrl()}/schools`;
        if (params.page && params.size) {
            url = `${url}?page=${params.page}&size=${params.size}`;
        }
        if ((!params.page || !params.size) && params.districtIds) {
            url = `${url}?districtIds=${params.districtIds}`;
        } else if (params.districtIds) {
            url = `${url}&districtIds=${params.districtIds}`;
        }
        return this.http.get<SchoolData>(url);
    }

    getSchoolsForFilter(params: FilterParams): Observable<SchoolData> {
        let url: string = `${this.configService.getApiUrl()}/schools/filter`;
        if (params.districtIds) {
            url = `${url}?districtIds=${params.districtIds}`;
        }
        return this.http.get<SchoolData>(url);
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.configService.getApiUrl()}/schools/upload`, formData);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { SchoolData } from '../../../models/school.model';
import { FilterParams } from '../../../models/filterParams.model';
import { ResponseFromBackend } from '../../../models/response.model';

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

    deleteSchool(schoolId: string): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/schools/${schoolId}`;
        return this.http.delete(url, { withCredentials: true });
    }

    deleteSchools(schoolIds: string): Observable<any> {
        console.log(schoolIds);
        const url: string = `${this.configService.getApiUrl()}/schools/delete/${schoolIds}`;
        return this.http.delete(url, { withCredentials: true });
    }

    uploadFile(file: File): Observable<ResponseFromBackend> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<ResponseFromBackend>(`${this.configService.getApiUrl()}/schools/upload`, formData, { withCredentials: true });
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { TeacherData } from '../../../models/teacher.model';
import { FilterParams } from '../../../models/filterParams.model';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

    getTeachers(param: FilterParams): Observable<TeacherData> {
        let url: string = `${this.configService.getApiUrl()}/teachers?page=${param.page}&size=${param.size}`;

        if (param.districtIds && param.districtIds.length > 0) {
            url = `${url}&districtIds=${param.districtIds}`;
        }
        if (param.schoolIds && param.schoolIds.length > 0) {
            url = `${url}&schoolIds=${param.schoolIds}`;
        }
        return this.http.get<TeacherData>(url);
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.configService.getApiUrl()}/teachers/upload`, formData);
    }
}

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

    getTeachers(params: FilterParams): Observable<TeacherData> {
        let url: string = `${this.configService.getApiUrl()}/teachers?page=${params.page}&size=${params.size}`;

        if (params.districtIds && params.districtIds.length > 0) {
            url = `${url}&districtIds=${params.districtIds}`;
        }
        if (params.schoolIds && params.schoolIds.length > 0) {
            url = `${url}&schoolIds=${params.schoolIds}`;
        }
        return this.http.get<TeacherData>(url);
    }

    getTeachersForFilter(params: FilterParams): Observable<TeacherData> {
        let url: string = `${this.configService.getApiUrl()}/teachers/filter`;
        if (params.schoolIds && params.schoolIds.length > 0) {
            url = `${url}?schoolIds=${params.schoolIds}`;
        }
        return this.http.get<TeacherData>(url);
    }

    deleteTeacher(teacherId: string): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/teachers/${teacherId}`;
        return this.http.delete(url);
    }

    deleteTeachers(teacherIds: string): Observable<any> {
        console.log(teacherIds);
        const url: string = `${this.configService.getApiUrl()}/teachers/delete/${teacherIds}`;
        return this.http.delete(url);
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.configService.getApiUrl()}/teachers/upload`, formData);
    }
}

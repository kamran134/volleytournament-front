import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { Observable } from 'rxjs';
import { Teacher, TeacherData } from '../../../core/models/teacher.model';
import { FilterParams } from '../../../core/models/filterParams.model';
import { ResponseFromBackend } from '../../../core/models/response.model';
import { RepairingResults } from '../../../core/models/student.model';

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

        console.log('params', params);
        return this.http.get<TeacherData>(url);
    }

    getTeachersForFilter(params: FilterParams): Observable<TeacherData> {
        let url: string = `${this.configService.getApiUrl()}/teachers/filter`;
        if (params.schoolIds && params.schoolIds.length > 0) {
            url = `${url}?schoolIds=${params.schoolIds}`;
        }
        return this.http.get<TeacherData>(url);
    }

    createTeacher(teacher: Teacher): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/teachers`;
        return this.http.post(url, teacher, { withCredentials: true });
    }

    updateTeacher(teacher: Teacher): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/teachers/${teacher._id}`;
        return this.http.put(url, teacher, { withCredentials: true });
    }

    deleteTeacher(teacherId: string): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/teachers/${teacherId}`;
        return this.http.delete(url, { withCredentials: true });
    }

    deleteTeachers(teacherIds: string): Observable<any> {
        console.log(teacherIds);
        const url: string = `${this.configService.getApiUrl()}/teachers/delete/${teacherIds}`;
        return this.http.delete(url, { withCredentials: true });
    }

    repairTeachers(): Observable<RepairingResults> {
        const url: string = `${this.configService.getApiUrl()}/teachers/repair`;
        return this.http.get<RepairingResults>(url, { withCredentials: true });
    }

    uploadFile(file: File): Observable<ResponseFromBackend> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<ResponseFromBackend>(`${this.configService.getApiUrl()}/teachers/upload`, formData, { withCredentials: true });
    }
}

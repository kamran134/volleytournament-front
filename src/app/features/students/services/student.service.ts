import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FilterParams } from '../../../models/filterParams.model';
import { StudentData, StudentWithResult } from '../../../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    constructor(private http: HttpClient, private configService: ConfigService) { }

    getStudents(params: FilterParams): Observable<StudentData> {
        let url: string = `${this.configService.getApiUrl()}/students?page=${params.page}&size=${params.size}`;
        if (params.defective) {
            url = `${url}&defective=true`;
        }
        if (params.districtIds && params.districtIds.length > 0) {
            url = `${url}&districtIds=${params.districtIds}`;
        }
        if (params.schoolIds && params.schoolIds.length > 0) {
            url = `${url}&schoolIds=${params.schoolIds}`;
        }
        if (params.teacherIds && params.teacherIds.length > 0) {
            url = `${url}&teacherIds=${params.teacherIds}`;
        }
        if (params.grades && params.grades.length > 0) {
            url = `${url}&grades=${params.grades}`;
        }
        if (params.examIds && params.examIds.length > 0) {
            console.log('examIds: ', params.examIds)
            url = `${url}&examIds=${params.examIds}`
        }
        return this.http.get<StudentData>(url);
    }

    getStudentById(studentId: string): Observable<StudentWithResult> {
        let url: string = `${this.configService.getApiUrl()}/students/${studentId}`;
        return this.http.get<StudentWithResult>(url);
    }

    searchStudents(searchString: string): Observable<StudentData> {
        let url: string = `${this.configService.getApiUrl()}/students/search/${searchString}`;
        return this.http.get<StudentData>(url);
    }

    deleteStudent(studentId: string): Observable<any> {
        const url: string = `${this.configService.getApiUrl()}/students/${studentId}`;
        return this.http.delete(url);
    }

    deleteStudents(studentIds: string): Observable<any> {
        console.log(studentIds);
        const url: string = `${this.configService.getApiUrl()}/students/delete/${studentIds}`;
        return this.http.delete(url);
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.configService.getApiUrl()}/students/upload`, formData);
    }
}

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
        let url: string = `${this.configService.getApiUrl()}/students`;
        if (params.page && params.size) {
            url = `${url}?page=${params.page}&size=${params.size}`;
        }
        return this.http.get<StudentData>(url);
    }

    getStudentById(studentId: string): Observable<StudentWithResult> {
        let url: string = `${this.configService.getApiUrl()}/students/${studentId}`;
        return this.http.get<StudentWithResult>(url);
    }
}

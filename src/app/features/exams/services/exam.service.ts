import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { Exam, ExamData } from '../../../models/exam.model';
import { FilterParams } from '../../../models/filterParams.model';

@Injectable({
    providedIn: 'root'
})
export class ExamService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    getExams(params: FilterParams): Observable<ExamData> {
        let url: string = `${this.configService.getApiUrl()}/exams`;
        if (params.page && params.size) {
            url = `${url}?page=${params.page}&size=${params.size}`;
        }
        return this.http.get<ExamData>(url);
    }

    addExam(exam: {name: string, code: number, date: Date}): Observable<Exam> {
        const url: string = `${this.configService.getApiUrl()}/exams`;
        return this.http.post<Exam>(url, exam);
    }
}

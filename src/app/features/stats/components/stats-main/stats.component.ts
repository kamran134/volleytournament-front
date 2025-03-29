import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { Error } from '../../../../core/models/error.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Params, Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Stats } from '../../../../core/models/stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MonthNamePipe } from '../../../../shared/pipes/month-name.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Exam } from '../../../../core/models/exam.model';
import { ExamService } from '../../../exams/services/exam.service';
import { StudentTableComponent } from "./student-table.component";
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { District, DistrictData } from '../../../../core/models/district.model';
import { School, SchoolData } from '../../../../core/models/school.model';
import { Teacher, TeacherData } from '../../../../core/models/teacher.model';
import { FilterParams } from '../../../../core/models/filterParams.model';
import { TeacherService } from '../../../teachers/services/teacher.service';
import { SchoolService } from '../../../schools/services/school.service';
import { DistrictService } from '../../../districts/services/district.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Student } from '../../../../core/models/student.model';
import { StudentService } from '../../../students/services/student.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StatsFiltersComponent } from "../stats-filters/stats-filters.component";
import { RoundNumberPipe } from '../../../../shared/pipes/round-number.pipe';
import { StatsPagination } from '../../../../core/models/pagination.model';
import * as XLSX from 'xlsx';
import { StudentRatingTableComponent } from '../student-rating-table/student-rating-table.component';
import { ExamResult } from '../../../../core/models/examResult.model';

@Component({
    selector: 'app-stats',
    standalone: true,
    imports: [
    MatGridListModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
    MatTabsModule,
    MatSortModule,
    MatSortHeader,
    CommonModule,
    ReactiveFormsModule,
    MonthNamePipe,
    RouterModule,
    StudentRatingTableComponent,
    StatsFiltersComponent,
    RoundNumberPipe
],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
    @ViewChild('teacherSort') teacherSort!: MatSort;
    @ViewChild('schoolSort') schoolSort!: MatSort;
    monthControl = new FormControl(new Date());
    matSnackConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    isloading: boolean = false;
    isUpdating: boolean = false;
    stats: Stats = {
        studentsOfMonth: [],
        studentsOfMonthByRepublic: [],
        developingStudents: [],
        students: [],
        teachers: [],
        schools: [],
        districts: [],
        studentsRating: []
    };
    totalCounts: StatsPagination = {
        studentsTotalCount: 0,
        allStudentsTotalCount: 0,
        allTeachersTotalCount: 0,
        allSchoolsTotalCount: 0,
        allDistrictsTotalCount: 0
    };
    selectedTab: 'students' | 'allStudents' | 'allTeachers' | 'allSchools' | 'allDistricts' = 'students';
    columns: string[] = ['code', 'fullName', 'score', 'grade', 'teacher', 'school', 'district'];
    teacherColumns: string[] = ['code', 'fullName', 'school', 'district', 'score'];
    schoolColumns: string[] = ['code', 'name', 'district', 'score'];
    districtColumns: string[] = ['code', 'name', 'score'];
    selectedMonth: string = new Date().getMonth() + '-' + new Date().getFullYear();
    selectedDistrictIds: string[] = [];
    selectedSchoolIds: string[] = [];
    selectedTeacherIds: string[] = [];
    selectedGrades: number[] = [];
    selectedExamId: string = '';
    districts: District[] = [];
    schools: School[] = [];
    teachers: Teacher[] = [];
    students: Student[] = [];
    totalCount: number = 0;
    pageSize: number = 100;
    pageIndex: number = 0;
    exams: Exam[] = [];
    errorMessage: string = '';
    gradesOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    studentsDisplayedColumns: string[] = ['code', 'lastName', 'firstName', 'middleName', 'grade', 'teacher', 'school', 'district', 'score'];
    teachersDataSource = new MatTableDataSource(this.stats.teachers);
    schoolsDataSource = new MatTableDataSource(this.stats.schools);
    districtsDataSource = new MatTableDataSource(this.districts);

    constructor(
        private authService: AuthService,
        private statsService: StatsService,
        private districtService: DistrictService,
        private schoolService: SchoolService,
        private teacherService: TeacherService,
        private studentService: StudentService,
        private examService: ExamService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.loadExams();
        this.loadDistricts();
        this.route.queryParams.subscribe((params: Params) => {
            this.selectedDistrictIds = params['districtIds'] ? params['districtIds'].split(',') : [];
            this.selectedSchoolIds = params['schoolIds'] ? params['schoolIds'].split(',') : [];
            this.selectedTeacherIds = params['teacherIds'] ? params['teacherIds'].split(',') : [];
            this.selectedGrades = params['grades'] ? params['grades'].split(',').map(Number) : [];
            this.selectedExamId = params['examId'] || '';
            this.selectedMonth = params['month'] || new Date().getFullYear() + '-' + new Date().getMonth();
            this.loadStudentsStats();
        });
    }

    isAdminOrSuperAdmin(): boolean {
        return this.authService.isAdminOrSuperAdmin();
    }

    ngAfterViewInit(): void {
        this.teachersDataSource.sort = this.teacherSort;
        this.schoolsDataSource.sort = this.schoolSort;
    }

    loadStudentsStats(): void {
        this.isloading = true;
        this.stats = {};

        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(",")
        };
        
        this.statsService.getStudentsStats(this.selectedMonth, params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = {...response};
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        })
    }

    loadAllStudentsStats(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(",")
        };

        this.studentService.getStudentsForStats(params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats.students = response.data;
                this.totalCounts.allStudentsTotalCount = response.totalCount;
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadStatsByExam(): void {
        this.isloading = true;
        this.stats = {};

        this.statsService.getStatsByExam(this.selectedExamId).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = response;
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadDistrictsStats(): void {
        this.isloading = true;
        this.stats = {};

        if (this.stats.districts && this.stats.districts.length > 0) return;

        this.statsService.getDistrictsStats().subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = {...this.stats, ...response};
                this.districtsDataSource.data = this.stats.districts || [];
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadTeachers(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            schoolIds: this.selectedSchoolIds.join(","),
            districtIds: this.selectedDistrictIds.join(",")
        }

        if (this.selectedTab === 'allTeachers') {
            this.teacherService.getTeachers(params)
            .subscribe({
                next: (response: TeacherData) => {
                    this.stats = { ...this.stats, teachers: response.data };
                    this.totalCount = response.totalCount;
                },
                error: (error: Error) => {
                    this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                }
            });
        } else {
            this.teacherService.getTeachersForFilter(params)
            .subscribe({
                next: (response: TeacherData) => {
                    this.teachers = response.data;
                },
                error: (error: Error) => {
                    this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                }
            });
        }
    }

    loadSchools(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(",")
        }

        if (this.selectedTab === 'allSchools') {
            this.schoolService.getSchools(params)
            .subscribe({
                next: (response: SchoolData) => {
                    this.stats = { ...this.stats, schools: response.data };
                    this.totalCount = response.totalCount;
                },
                error: (error: Error) => {
                    this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                }
            });
        } else {
            this.schoolService.getSchoolsForFilter(params)
            .subscribe({
                next: (response: SchoolData) => {
                    this.schools = response.data;
                },
                error: (error: Error) => {
                    this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                }
            });
        }
    }

    loadDistricts(): void {
        this.districtService.getDistricts()
        .subscribe({
            next: (response: DistrictData) => {
                this.districts = response.data;
            },
            error: (error: Error) => {
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadExams(): void {
        this.examService.getExams({ page: 0, size: 1000 })
        .subscribe({
            next: (response) => {
                this.exams = response.data
            },
            error: (err: any) => {
                this.errorMessage = '';
            }
        });
    }


    // Button Handlers

    updateStats(): void {
        this.isUpdating = true;
        this.statsService.updateStats().subscribe({
            next: (response) => {
                this.isUpdating = false;
                this.snackBar.open('Statistika yeniləndi', 'OK', this.matSnackConfig);
            },
            error: (error: Error) => {
                this.isUpdating = false;
                this.snackBar.open(`${error.error.message}`, 'Bağla', this.matSnackConfig);
            }
        });
    }

    updateMonth(month: string) {
        this.selectedMonth = month;
        this.loadStudentsStats();
    }

    onTabChange(event: any): void {
        if (event.index === 0) {
            this.selectedTab = 'students';
            this.loadStudentsStats();
        } else if (event.index === 1) {
            this.selectedTab = 'allStudents';
            this.loadAllStudentsStats();
        } else if (event.index === 2) {
            this.selectedTab = 'allTeachers';
            this.loadTeachers();
        } else if (event.index === 3) {
            this.selectedTab = 'allSchools'
            this.loadSchools();
        } else if (event.index === 4) {
            this.selectedTab = 'allDistricts'
            this.loadDistrictsStats();
        }
    }

    onDistrictSelectChanged(districtIds: string[]) {
        this.selectedDistrictIds = districtIds;
        if (this.selectedTab === 'students') {
            this.loadSchools();
            this.loadTeachers();
            this.loadStudentsStats();
        }
        else if (this.selectedTab === 'allStudents') {
            this.loadSchools();
            this.loadTeachers();
            this.loadAllStudentsStats();
        }
        else if (this.selectedTab === 'allTeachers') {
            this.loadSchools();
            this.loadTeachers();
        }
        else if (this.selectedTab === 'allSchools') {
            this.loadSchools();
        }
    }

    onSchoolSelectChanged(schoolIds: string[]) {
        this.selectedSchoolIds = schoolIds;
        if (this.selectedTab === 'students') {
            this.loadTeachers();
            this.loadStudentsStats();
        }
        else if (this.selectedTab === 'allStudents') {
            this.loadTeachers();
            this.loadAllStudentsStats();
        }
        else if (this.selectedTab === 'allTeachers') {
            this.loadTeachers();
        }
    }

    onTeacherSelectChanged(teacherIds: string[]) {
        this.selectedTeacherIds = teacherIds;
        this.loadStudentsStats();
    }

    onGradeSelectChanged(grades: number[]) {
        this.selectedGrades = grades;
        this.loadStudentsStats();
    }

    onExamSelectChanged(examId: string) {
        this.selectedExamId = examId;
        this.loadStatsByExam();
    }

    openStudentDetails(studentId: string): void {
        const selectedDate = this.monthControl.value;
        if (!selectedDate) return;

        const month = selectedDate.toISOString().slice(0, 7);

        const queryParams = {
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(","),
            examId: this.selectedExamId,
            month,
            source: 'stats'
        };
    
        const navigationExtras: NavigationExtras = {
            queryParams: queryParams,
            replaceUrl: true
        };
    
        this.router.navigate(['/students', studentId], navigationExtras);
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        }
        else if (this.selectedTab === 'allTeachers') {
            this.loadTeachers();
        }
        else if (this.selectedTab === 'allSchools') {
            this.loadSchools();
        }
    }

    exportToExcel(tableName: 'developingStudents' | 'studentsOfMonth' | 'studentsOfMonthByRepublic' | 'allStudents' | 'allTeachers' | 'allSchools' | 'allDistricts') {
        const workbook = XLSX.utils.book_new();
        let sheetName: string = '';
        let result: XLSX.WorkSheet = {};

        switch (tableName) {
            case 'developingStudents': {
                result = XLSX.utils.json_to_sheet(this.formatStudentData(this.stats.developingStudents || []));
                sheetName = `İE şagirdlər (${this.selectedMonth})`;
                break;
            }
            case 'studentsOfMonth': {
                result = XLSX.utils.json_to_sheet(this.formatStudentData(this.stats.studentsOfMonth || []));
                sheetName = `AŞ (${this.selectedMonth})`;
                break;
            }
            case 'studentsOfMonthByRepublic': {
                result = XLSX.utils.json_to_sheet(this.formatStudentData(this.stats.studentsOfMonthByRepublic || []));
                sheetName = `AŞ respublika üzrə (${this.selectedMonth})`;
                break;
            }
            case 'allStudents': {
                result = XLSX.utils.json_to_sheet(this.formatAllStudentData(this.stats.students || []));
                sheetName = 'İlin şagirdləri';
                break;
            }
            case 'allTeachers': {
                result = XLSX.utils.json_to_sheet(this.formatTeacherData(this.stats.teachers || []));
                sheetName = 'İlin müəllimləri';
                break;
            }
            case 'allSchools': {
                result = XLSX.utils.json_to_sheet(this.formatSchoolData(this.stats.schools || []));
                sheetName = 'İlin məktəbləri';
                break;
            }
            case 'allDistricts': {
                result = XLSX.utils.json_to_sheet(this.formatDistrictData(this.stats.districts || []));
                sheetName = 'İlin rayonları';
                break;
            }
        }

        this.formatHeaders(result);
        XLSX.utils.book_append_sheet(workbook, result, sheetName);
        XLSX.writeFile(workbook, `${sheetName}.xlsx`);
    }

    private formatStudentData(students: ExamResult[]): any[] {
        return students.map(result => ({
            'Şagirdin kodu': (result.student || {}).code,
            'Soyadı': (result.student || {}).lastName,
            'Adı': (result.student || {}).firstName,
            'Atasının adı': (result.student || {}).middleName,
            'Sinifi': (result.student || {}).grade,
            'Müəllimi': (result.student || {}).teacher?.fullname || 'Müəllim tapılmadı',
            'Məktəbi': (result.student || {}).school?.name || 'Məktəb tapılmadı',
            'Rayonu': (result.student || {}).district?.name || 'Rayon tapılmadı',
            'Balı': result.totalScore
        }));
    }

    private formatAllStudentData(students: Student[]): any[] {
        return students.map(student => ({
            'Şagirdin kodu': student.code,
            'Soyadı': student.lastName,
            'Adı': student.firstName,
            'Atasının adı': student.middleName,
            'Sinifi': student.grade,
            'Müəllimi': student.teacher?.fullname || 'Müəllim tapılmadı',
            'Məktəbi': student.school?.name || 'Məktəb tapılmadı',
            'Rayonu': student.district?.name || 'Rayon tapılmadı',
            'Ümumi balı': student.score || 0,
            'Orta balı': student.averageScore || 0,
        }));
    }

    // Форматирование данных для учителей
    private formatTeacherData(teachers: Teacher[]): any[] {
        return teachers.map(teacher => ({
            'Müəllimin kodu': teacher.code,
            'Soyadı, adı, ata adı': teacher.fullname,
            'Məktəbi': teacher.school?.name || '',
            'Rayonu': teacher.district?.name || '',
            'Ümumi balı': teacher.score,
            'Orta balı': teacher.averageScore,
        }));
    }

    // Форматирование данных для школ
    private formatSchoolData(schools: School[]): any[] {
        return schools.map(school => ({
            'Məktəbin kodu': school.code,
            'Adı': school.name,
            'Rayonu': school.district?.name || '',
            'Ümumi balı': school.score,
            'Orta balı': school.averageScore,
        }));
    }

    // Форматирование данных для районов
    private formatDistrictData(districts: District[]): any[] {
        return districts.map(district => ({
            'Rayon kodu': district.code,
            'Adı': district.name,
            'Ümumi balı': district.score,
            'Orta balı': district.averageScore,
        }));
    }

    private formatHeaders(ws: XLSX.WorkSheet) {
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1'); // Получаем диапазон данных
        const headerRow = 0; // Первая строка — это заголовки
    
        for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (!ws[cellAddress]) continue;
            // Применяем стили к заголовкам
            ws[cellAddress].s = {
                font: {
                    bold: true, // Жирный шрифт
                    sz: 14,     // Размер шрифта (14 — чуть больше стандартного)
                },
                alignment: {
                    horizontal: 'center', // Выравнивание по центру (опционально)
                },
            };
        }
    
        // Устанавливаем высоту строки заголовков (опционально)
        if (!ws['!rows']) ws['!rows'] = [];
        ws['!rows'][headerRow] = { hpt: 20 }; // Высота строки в пунктах
    }
}

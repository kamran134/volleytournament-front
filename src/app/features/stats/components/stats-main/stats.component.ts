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
import { MatSort, MatSortHeader, MatSortModule, Sort } from '@angular/material/sort';
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
import { ExcelService } from '../../../../core/services/excel.service';

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
    @ViewChild('studentSort') studentSort!: MatSort;
    @ViewChild('districtSort') districtSort!: MatSort;
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
    monthStudentColumns: string[] = [];
    studentColumns: string[] = [];
    teacherColumns: string[] = [];
    schoolColumns: string[] = [];
    districtColumns: string[] = [];

    private readonly availableStudentColumns: string[] = [
        'code', 'lastName', 'firstName', 'middleName', 'grade', 'teacher', 'school', 'district', 'score', 'averageScore'
    ];
    private readonly availableTeacherColumns: string[] = ['code', 'fullName', 'school', 'district', 'score', 'averageScore'];
    private readonly availableSchoolColumns: string[] = ['code', 'name', 'district', 'score', 'averageScore'];
    private readonly availableDistrictColumns: string[] = ['code', 'name', 'score', 'averageScore'];

    selectedMonth: string = new Date().getMonth() + '-' + new Date().getFullYear();
    selectedDistrictIds: string[] = [];
    selectedSchoolIds: string[] = [];
    selectedTeacherIds: string[] = [];
    selectedGrades: number[] = [];
    selectedExamId: string = '';
    selectedTabIndex: number = 0;
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
    studentsDataSource = new MatTableDataSource(this.stats.students);
    teachersDataSource = new MatTableDataSource(this.stats.teachers);
    schoolsDataSource = new MatTableDataSource(this.stats.schools);
    districtsDataSource = new MatTableDataSource(this.districts);
    darkMode: boolean = false;
    searchString: string = '';

    constructor(
        private authService: AuthService,
        private statsService: StatsService,
        private districtService: DistrictService,
        private schoolService: SchoolService,
        private teacherService: TeacherService,
        private studentService: StudentService,
        private examService: ExamService,
        private excelService: ExcelService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        if (typeof localStorage !== 'undefined') {
            this.darkMode = localStorage.getItem('theme') === 'true';
        }
        if (typeof localStorage !== 'undefined') {
            this.loadSettings();
        }

        this.loadExams();
        this.loadDistricts();
        this.route.queryParams.subscribe((params: Params) => {
            this.selectedDistrictIds = params['districtIds'] ? params['districtIds'].split(',') : [];
            this.selectedSchoolIds = params['schoolIds'] ? params['schoolIds'].split(',') : [];
            this.selectedTeacherIds = params['teacherIds'] ? params['teacherIds'].split(',') : [];
            this.selectedGrades = params['grades'] ? params['grades'].split(',').map(Number) : [];
            this.selectedExamId = params['examId'] || '';
            this.selectedMonth = params['month'] || new Date().getFullYear() + '-' + new Date().getMonth();
            this.selectedTab = params['tab'] || 'students';

            if (this.selectedTab === 'students') {
                this.selectedTabIndex = 0;
                this.loadStudentsStats();
            } else if (this.selectedTab === 'allStudents') {
                this.selectedTabIndex = 1;
                this.loadAllStudentsStats();
            }
        });
    }

    isAdminOrSuperAdmin(): boolean {
        return this.authService.isAdminOrSuperAdmin();
    }

    // CHANGE: Метод для загрузки настроек из localStorage
    private loadSettings() {
        const saved = localStorage.getItem('dashboard-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            // Применяем тему
            this.darkMode = settings.theme ?? false;
            // Применяем столбцы
            if (settings.monthStudentColumns) {
                const selectedColumns = settings.monthStudentColumns.split(',');
                this.monthStudentColumns = this.availableStudentColumns.filter(col => selectedColumns.includes(col));
            }
            if (settings.studentColumns) {
                const selectedColumns = settings.studentColumns.split(',');
                this.studentColumns = this.availableStudentColumns.filter(col => selectedColumns.includes(col));
            }
            if (settings.schoolColumns) {
                const selectedColumns = settings.schoolColumns.split(',');
                this.schoolColumns = this.availableSchoolColumns.filter(col => selectedColumns.includes(col));
            }
            if (settings.teacherColumns) {
                const selectedColumns = settings.teacherColumns.split(',');
                this.teacherColumns = this.availableTeacherColumns.filter(col => selectedColumns.includes(col));
            }
            if (settings.districtColumns) {
                const selectedColumns = settings.districtColumns.split(',');
                this.districtColumns = this.availableDistrictColumns.filter(col => selectedColumns.includes(col));
            }
        }
    }

    loadStudentsStats(): void {
        this.isloading = true;
        this.stats = {};

        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(","),
            code: this.searchString || undefined,
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

    loadAllStudentsStats(sortActive?: string, sortDirection?: 'asc' | 'desc'): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(","),
            sortColumn: sortActive || 'averageScore',
            sortDirection: sortDirection || 'desc',
            code: this.searchString || undefined,
        };

        this.studentService.getStudentsForStats(params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats.students = response.data;
                this.studentsDataSource.data = response.data;
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

    loadTeachersStats(sortActive?: string, sortDirection?: 'asc' | 'desc'): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(","),
            sortColumn: sortActive || 'averageScore',
            sortDirection: sortDirection || 'desc',
            code: this.searchString || undefined,
        }

        this.teacherService.getTeachers(params).subscribe({
            next: (response: TeacherData) => {
                this.isloading = false;
                this.stats = { ...this.stats, teachers: response.data.filter((teacher: Teacher) => teacher.active &&
                    teacher.school && teacher.school.active) };
                this.totalCounts.allTeachersTotalCount = response.totalCount;
                this.teachersDataSource.data = this.stats.teachers || [];
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadSchoolsStats(sortActive?: string, sortDirection?: 'asc' | 'desc'): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(","),
            teacherIds: this.selectedTeacherIds.join(","),
            grades: this.selectedGrades.join(","),
            sortColumn: sortActive || 'averageScore',
            sortDirection: sortDirection || 'desc',
            code: this.searchString || undefined,
        }

        this.schoolService.getSchools(params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = { ...this.stats, schools: response.data.filter((school: School) => school.active) };
                this.totalCounts.allSchoolsTotalCount = response.totalCount;
                this.schoolsDataSource.data = this.stats.schools || [];
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }
    
    loadDistrictsStats(sortActive?: string, sortDirection?: 'asc' | 'desc'): void {
        const params: FilterParams = {
            sortColumn: sortActive || 'averageScore',
            sortDirection: sortDirection || 'desc',
            code: this.searchString || undefined,
        }

        this.districtService.getDistricts(params).subscribe({
            next: (response: DistrictData) => {
                this.isloading = false;
                this.stats = {...this.stats, districts: response.data};
                this.totalCounts.allDistrictsTotalCount = response.totalCount;
                this.districtsDataSource.data = this.stats.districts || [];
            },
            error: (error: Error) => {
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }


    loadTeachers(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            schoolIds: this.selectedSchoolIds.join(","),
            districtIds: this.selectedDistrictIds.join(","),
            sortColumn: 'fullname',
            sortDirection: 'asc'
        }

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

    loadSchools(): void {
        const params: FilterParams = {
            page: this.pageIndex + 1,
            size: this.pageSize,
            districtIds: this.selectedDistrictIds.join(","),
            sortColumn: 'name',
            sortDirection: 'asc',
        }

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

    loadDistricts(): void {
        const params: FilterParams = {
            sortColumn: 'name',
            sortDirection: 'asc'
        }
        
        this.districtService.getDistricts(params)
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
        this.isloading = true;

        if (event.index === 0) {
            this.selectedTab = 'students';
            this.loadStudentsStats();
        } else if (event.index === 1) {
            this.selectedTab = 'allStudents';
            this.loadAllStudentsStats();
        } else if (event.index === 2) {
            this.selectedTab = 'allTeachers';
            this.loadTeachersStats();
        } else if (event.index === 3) {
            this.selectedTab = 'allSchools'
            this.loadSchoolsStats();
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
            this.loadTeachersStats();
        }
        else if (this.selectedTab === 'allSchools') {
            this.loadSchoolsStats();
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
            this.loadTeachersStats();
        }
    }

    onTeacherSelectChanged(teacherIds: string[]) {
        this.selectedTeacherIds = teacherIds;
        if (this.selectedTab === 'students') {
            this.loadStudentsStats();
        }
        else if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        }
    }

    onGradeSelectChanged(grades: number[]) {
        this.selectedGrades = grades;
        if (this.selectedTab === 'students') {
            this.loadStudentsStats();
        }
        else if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        }
    }

    onExamSelectChanged(examId: string) {
        this.selectedExamId = examId;
        if (this.selectedTab === 'students') {
            this.loadStudentsStats();
        }
        else if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        }
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
            source: 'stats',
            tab: this.selectedTab,
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

        this.isloading = true;

        if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        }
        else if (this.selectedTab === 'allTeachers') {
            this.loadTeachersStats();
        }
        else if (this.selectedTab === 'allSchools') {
            this.loadSchoolsStats();
        }
    }

    onSortChange(sortState: Sort): void {
        this.pageIndex = 0; // Сбрасываем страницу
        if (sortState.direction) {
            if (this.selectedTab === 'allStudents') {
                this.loadAllStudentsStats(sortState.active, sortState.direction);
            }
            else if (this.selectedTab === 'allTeachers') {
                this.loadTeachersStats(sortState.active, sortState.direction);
            }
            else if (this.selectedTab === 'allSchools') {
                this.loadSchoolsStats(sortState.active, sortState.direction);
            }
            else if (this.selectedTab === 'allDistricts') {
                this.loadDistrictsStats(sortState.active, sortState.direction);
            }
        } else {
            if (this.selectedTab === 'allStudents') {
                this.loadAllStudentsStats();
            }
            else if (this.selectedTab === 'allTeachers') {
                this.loadTeachersStats();
            }
            else if (this.selectedTab === 'allSchools') {
                this.loadSchoolsStats();
            }
            else if (this.selectedTab === 'allDistricts') {
                this.loadDistrictsStats();
            }
        }
    }

    onSearchChange(searchString: string) {
        this.pageIndex = 0; // Сбрасываем страницу
        this.searchString = searchString;
        if (this.selectedTab === 'students') {
            this.loadStudentsStats();
        } else if (this.selectedTab === 'allStudents') {
            this.loadAllStudentsStats();
        } else if (this.selectedTab === 'allTeachers') {
            this.loadTeachersStats();
        } else if (this.selectedTab === 'allSchools') {
            this.loadSchoolsStats();
        } else if (this.selectedTab === 'allDistricts') {
            this.loadDistrictsStats();
        }
    }

    exportToExcel(tableName: 'developingStudents' | 'studentsOfMonth' | 'studentsOfMonthByRepublic' | 'allStudents' | 'allTeachers' | 'allSchools' | 'allDistricts') {
        const workbook = XLSX.utils.book_new();
        let sheetName: string = '';
        let result: XLSX.WorkSheet = {};

        switch (tableName) {
            case 'developingStudents': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatStudentData(this.stats.developingStudents || []));
                sheetName = `İE şagirdlər (${this.selectedMonth})`;
                break;
            }
            case 'studentsOfMonth': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatStudentData(this.stats.studentsOfMonth || []));
                sheetName = `AŞ (${this.selectedMonth})`;
                break;
            }
            case 'studentsOfMonthByRepublic': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatStudentData(this.stats.studentsOfMonthByRepublic || []));
                sheetName = `AŞ respublika üzrə (${this.selectedMonth})`;
                break;
            }
            case 'allStudents': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatAllStudentData(this.stats.students || []));
                sheetName = 'İlin şagirdləri';
                break;
            }
            case 'allTeachers': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatTeacherData(this.stats.teachers || []));
                sheetName = 'İlin müəllimləri';
                break;
            }
            case 'allSchools': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatSchoolData(this.stats.schools || []));
                sheetName = 'İlin məktəbləri';
                break;
            }
            case 'allDistricts': {
                result = XLSX.utils.json_to_sheet(this.excelService.formatDistrictData(this.stats.districts || []));
                sheetName = 'İlin rayonları / şəhərləri';
                break;
            }
        }

        this.excelService.formatHeaders(result);
        XLSX.utils.book_append_sheet(workbook, result, sheetName);
        XLSX.writeFile(workbook, `${sheetName}.xlsx`);
    }
}

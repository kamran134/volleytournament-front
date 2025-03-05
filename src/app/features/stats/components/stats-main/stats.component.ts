import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { StatsService } from '../../services/stats.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { Error } from '../../../../models/error.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Params, Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Stats } from '../../../../models/stats.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Exam } from '../../../../models/exam.model';
import { ExamService } from '../../../exams/services/exam.service';
import { StudentTableComponent } from "./student-table.component";
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { District, DistrictData } from '../../../../models/district.model';
import { School, SchoolData } from '../../../../models/school.model';
import { Teacher, TeacherData } from '../../../../models/teacher.model';
import { FilterParams } from '../../../../models/filterParams.model';
import { TeacherService } from '../../../teachers/services/teacher.service';
import { SchoolService } from '../../../schools/services/school.service';
import { DistrictService } from '../../../districts/services/district.service';
import { AuthService } from '../../../../services/auth.service';

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
        MatInputModule,
        MatTabsModule,
        MatSortModule,
        MatSortHeader,
        CommonModule,
        ReactiveFormsModule,
        MonthNamePipe,
        RouterModule,
        StudentTableComponent
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
        teachers: [],
        schools: [],
        districts: []
    };
    columns: string[] = ['code', 'fullName', 'score', 'grade', 'teacher', 'school', 'district'];
    teacherColumns: string[] = ['code', 'fullName', 'school', 'district', 'averageScore', 'score'];
    schoolColumns: string[] = ['code', 'name', 'district', 'averageScore', 'score'];
    districtColumns: string[] = ['code', 'name', 'averageScore', 'score'];
    selectedMonth: string = '';
    selectedDistrictIds: string[] = [];
    selectedSchoolIds: string[] = [];
    selectedTeacherIds: string[] = [];
    selectedGrades: number[] = [];
    selectedExamId: string = '';
    districts: District[] = [];
    schools: School[] = [];
    teachers: Teacher[] = [];
    exams: Exam[] = [];
    errorMessage: string = '';
    gradesOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    teachersDataSource = new MatTableDataSource(this.stats.teachers);
    schoolsDataSource = new MatTableDataSource(this.stats.schools);
    districtsDataSource = new MatTableDataSource(this.districts);

    constructor(
        private statsService: StatsService,
        private snackBar: MatSnackBar,
        private examService: ExamService,
        private districtService: DistrictService,
        private schoolService: SchoolService,
        private teacherService: TeacherService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
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
            this.selectedMonth = params['month'] || '';
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
                this.stats = response;
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        })
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

    loadTeachersStats(): void {
        this.isloading = true;
        this.stats = {};

        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(","),
            schoolIds: this.selectedSchoolIds.join(",")
        };

        if (this.stats.teachers && this.stats.teachers.length > 0) return;

        this.statsService.getTeachersStats(params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = {...this.stats, ...response};
                this.teachersDataSource.data = this.stats.teachers || [];
            },
            error: (error: Error) => {
                this.isloading = false;
                this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
            }
        });
    }

    loadSchoolsStats(): void {
        this.isloading = true;
        this.stats = {};

        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(",")
        };

        if (this.stats.schools && this.stats.schools.length > 0) return;

        this.statsService.getSchoolsStats(params).subscribe({
            next: (response) => {
                this.isloading = false;
                this.stats = {...this.stats, ...response};
                this.schoolsDataSource.data = this.stats.schools || [];
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
            schoolIds: this.selectedSchoolIds.join(",")
        }

        this.teacherService.getTeachersForFilter(params)
            .subscribe({
                next: (response: TeacherData) => {
                    this.teachers = response.data;
                },
                error: (error: Error) => {
                    this.snackBar.open(error.error.message, 'Bağla', this.matSnackConfig);
                }
            })

    }

    loadSchools(): void {
        const params: FilterParams = {
            districtIds: this.selectedDistrictIds.join(",")
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

    updateMonth(event: any, datepicker: MatDatepicker<Date>) {
        const selectedDate = new Date(event);
        this.monthControl.setValue(selectedDate);
        
        if (!this.monthControl.value) return;
        this.selectedMonth = selectedDate.toISOString().slice(0, 7);
        datepicker.close();
        this.loadStudentsStats();
    }

    onTabChange(event: any): void {
        if (event.index === 0) {
            this.loadStudentsStats();
        } else if (event.index === 1) {
            this.loadTeachersStats();
        } else if (event.index === 2) {
            this.loadSchoolsStats();
        } else if (event.index === 3) {
            this.loadDistrictsStats();
        }
    }

    onDistrictSelectChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadSchools();
        this.loadTeachers();
        this.loadStudentsStats();
    }

    onSchoolSelectChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadTeachers();
        this.loadStudentsStats();
    }

    onTeacherSelectChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadStudentsStats();
    }

    onGrageSelectChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadStudentsStats();
    }

    onExamSelectChanged(): void {
        this.loadStatsByExam();
    }

    onDistrictSelectForTeacherChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadSchools();
        this.loadTeachersStats();
    }

    onSchoolSelectForTeacherChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadTeachersStats();
    }

    onDistrictSelectForSchoolChanged(): void {
        this.stats = {}; // Очищаем список студентов
        this.loadSchoolsStats();
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
}

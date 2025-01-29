import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { DistrictsListComponent } from './features/districts/components/districts-list/districts-list.component';
import { SchoolsListComponent } from './features/schools/components/schools-list/schools-list.component';
import { TeachersListComponent } from './features/teachers/components/teachers-list/teachers-list.component';
import { ExamsListComponent } from './features/exams/components/exams-list/exams-list.component';
import { ExamResultsListComponent } from './features/examResults/components/exam-results-list/exam-results-list.component';
import { StudentsListComponent } from './features/students/components/students-list/students-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'districts', component: DistrictsListComponent },
    { path: 'schools', component: SchoolsListComponent },
    { path: 'teachers', component: TeachersListComponent },
    { path: 'students', component: StudentsListComponent },
    { path: 'exams', component: ExamsListComponent },
    { path: 'exam-results', component: ExamResultsListComponent },
    { path: '**', redirectTo: '' }
];

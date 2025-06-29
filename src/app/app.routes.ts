import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { DistrictsListComponent } from './features/districts/components/districts-list/districts-list.component';
import { SchoolsListComponent } from './features/schools/components/schools-list/schools-list.component';
import { TeachersListComponent } from './features/teachers/components/teachers-list/teachers-list.component';
import { ExamsListComponent } from './features/exams/components/exams-list/exams-list.component';
import { StudentsListComponent } from './features/students/components/students-list/students-list.component';
import { StudentDetailsComponent } from './features/students/components/student-details/student-details.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/register/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'districts', component: DistrictsListComponent, canActivate: [authGuard] },
    { path: 'schools', component: SchoolsListComponent, canActivate: [authGuard] },
    { path: 'teachers', component: TeachersListComponent, canActivate: [authGuard] },
    { path: 'students', component: StudentsListComponent, canActivate: [authGuard] },
    { path: 'students/:id', component: StudentDetailsComponent, canActivate: [authGuard] },
    { path: 'exams', component: ExamsListComponent, canActivate: [authGuard] },
    { path: 'admin', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes), canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { DistrictsListComponent } from './features/districts/components/districts-list/districts-list.component';
import { SchoolsListComponent } from './features/schools/components/schools-list/schools-list.component';
import { TeachersListComponent } from './features/teachers/components/teachers-list/teachers-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'districts', component: DistrictsListComponent },
    { path: 'schools', component: SchoolsListComponent },
    { path: 'teachers', component: TeachersListComponent },
    { path: '**', redirectTo: '' }
];

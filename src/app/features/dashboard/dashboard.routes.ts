import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { UsersComponent } from './components/users/users.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'tournaments', component: TournamentsComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];
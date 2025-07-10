import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { UsersComponent } from './components/users/users.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { TeamsComponent } from './components/teams/teams.component';
import { GamersComponent } from './components/gamers/gamers.component';
import { GamesComponent } from './components/games/games.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'tournaments', component: TournamentsComponent },
            { path: 'teams', component: TeamsComponent },
            { path: 'players', component: GamersComponent },
            { path: 'games', component: GamesComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];
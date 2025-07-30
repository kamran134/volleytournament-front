import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { UsersComponent } from './components/users/users.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { TeamsComponent } from './components/teams/teams.component';
import { GamersComponent } from './components/gamers/gamers.component';
import { GamesComponent } from './components/games/games.component';
import { LocationsComponent } from './components/locations/locations.component';
import { GalleryComponent } from './components/gallery/gallery.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'tournaments', component: TournamentsComponent },
            { path: 'tours', component: TournamentsComponent },
            { path: 'teams', component: TeamsComponent },
            { path: 'players', component: GamersComponent },
            { path: 'games', component: GamesComponent },
            { path: 'locations', component: LocationsComponent },
            { path: 'gallery', component: GalleryComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    }
];
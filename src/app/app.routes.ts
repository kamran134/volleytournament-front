import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/register/register/register.component';
import { TournamentMainComponent } from './features/tournament/components/tournament-main/tournament-main.component';
import { GalleryMainComponent } from './features/gallery/components/gallery-main/gallery-main.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'admin', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes), canActivate: [authGuard] },
    { path: 'tournament/:shortName', component: TournamentMainComponent },
    { path: 'gallery', component: GalleryMainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];
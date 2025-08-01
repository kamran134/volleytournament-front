import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Photo } from '../../../../core/models/photo.model';
import { GalleryService } from '../../services/gallery.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GalleryPhotoDialogComponent } from '../gallery-photo-dialog/gallery-photo-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tournament } from '../../../../core/models/tournament.model';
import { Tour } from '../../../../core/models/tour.model';
import { Team } from '../../../../core/models/team.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-gallery-main',
    standalone: true,
    imports: [
        MatGridListModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule
    ],
    animations: [
        trigger('skeletonAnimation', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [
                style({ opacity: 0.3 }),
                animate('800ms ease-in-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('800ms ease-in-out', style({ opacity: 0.3 }))
            ])
        ])
    ],
    templateUrl: './gallery-main.component.html',
    styleUrl: './gallery-main.component.scss'
})
export class GalleryMainComponent implements OnInit, AfterViewInit, OnDestroy {
    lastPhotos: Photo[] = [];
    photos: Photo[] = []; // This should be populated with actual photo data

    tournaments: Tournament[] = [];
    tours: Tour[] = [];
    teams: Team[] = [];

    selectedPhoto: Photo | null = null;
    selectedTournament: string | null = null;
    selectedTour: string | null = null;
    selectedTeam: string | null = null;

    // Pagination and loading state
    currentPage = 1;
    pageSize = 10;
    isLoading = false;
    hasMore = true; // Tracks if more photos are available
    private observer: IntersectionObserver | null = null;

    @ViewChild('galleryMain') galleryMain!: ElementRef;

    constructor(
        private galleryService: GalleryService,
        private dialog: MatDialog,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.loadTournaments();
        this.loadPhotos();
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.setupIntersectionObserver();
        }
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (isPlatformBrowser(this.platformId)) {
            this.enableScroll();
        }
    }

    setupIntersectionObserver(): void {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    private handleScroll(): void {
        if (this.isLoading || !this.hasMore) return;

        const galleryElement = this.galleryMain.nativeElement;
        const rect = galleryElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isAtBottom = rect.bottom <= windowHeight + 200; // Trigger 200px before bottom

        if (isAtBottom) {
            this.loadMorePhotos();
        }
    }

    loadTournaments(): void {
        this.galleryService.getTournaments().subscribe({
            next: (response) => {
                this.tournaments = response.data;
            },
            error: (error) => {
                console.error('Error loading tournaments:', error);
            }
        });
    }

    loadTours(): void {
        if (this.selectedTournament) {
            this.galleryService.getTours(this.selectedTournament).subscribe({
                next: (response) => {
                    this.tours = response.data;
                    this.loadPhotos();
                },
                error: (error) => {
                    console.error('Error loading tours:', error);
                }
            });
        }
    }

    loadPhotos(page: number = 1): void {
        if (this.isLoading) return; // Prevent multiple simultaneous requests
        this.isLoading = true;
        if (isPlatformBrowser(this.platformId)) {
            this.disableScroll();
        }

        const params = {
            page,
            size: 10,
            tournament: this.selectedTournament ? this.selectedTournament : undefined,
            teams: this.selectedTeam ? [this.selectedTeam] : [],
            tour: this.selectedTour ? this.selectedTour : undefined
        };

        this.galleryService.getPhotos(params).subscribe({
            next: (response) => {
                const newPhotos = response.data;
                // Uncomment the following line if you need to prepend the base URL to photo URLs
                // .map(photo => ({
                //     ...photo,
                //     url: 'https://volleytour.az/' + photo.url
                // }));

                if (page === 1) {
                    this.photos = newPhotos;
                } else {
                    this.photos = [...this.photos, ...newPhotos];
                }

                // Check if there are more photos to load
                this.hasMore = newPhotos.length === this.pageSize;
                this.currentPage = page;
                this.isLoading = false;
                this.enableScroll();
            },
            error: (error) => {
                console.error('Error loading photos:', error);
                this.isLoading = false;
                this.enableScroll();
            }
        });
    }

    loadMorePhotos(): void {
        if (this.hasMore) {
            this.loadPhotos(this.currentPage + 1);
        }
    }

    resetAndLoadPhotos(): void {
        this.currentPage = 1;
        this.photos = [];
        this.hasMore = true;
        this.isLoading = true;
        this.loadPhotos(this.currentPage);
    }

    openPhoto(photo: Photo): void {
        this.selectedPhoto = photo;
        this.dialog.open(GalleryPhotoDialogComponent, {
            data: photo,
        });
    }

    onTournamentChange(tournamentId: string): void {
        this.selectedTournament = tournamentId;
        this.teams = this.tournaments.find(t => t._id === tournamentId)?.teams || [];
        this.loadTours();
        this.loadPhotos();
    }

    onTourChange(tourId: string): void {
        this.selectedTour = tourId;
        this.loadPhotos();
    }

    onTeamChange(teamId: string): void {
        this.selectedTeam = teamId;
        this.loadPhotos();
    }

    private disableScroll(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        document.body.style.overflow = 'hidden';
    }

    private enableScroll(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        document.body.style.overflow = '';
    }
}

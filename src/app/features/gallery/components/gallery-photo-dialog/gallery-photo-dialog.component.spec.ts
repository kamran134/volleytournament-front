import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPhotoDialogComponent } from './gallery-photo-dialog.component';

describe('GalleryPhotoDialogComponent', () => {
  let component: GalleryPhotoDialogComponent;
  let fixture: ComponentFixture<GalleryPhotoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryPhotoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalleryPhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

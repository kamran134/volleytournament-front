import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoEditDialogComponent } from './photo-edit-dialog.component';

describe('PhotoEditDialogComponent', () => {
  let component: PhotoEditDialogComponent;
  let fixture: ComponentFixture<PhotoEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

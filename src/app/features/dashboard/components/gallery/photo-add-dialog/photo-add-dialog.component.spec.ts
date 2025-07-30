import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoAddDialogComponent } from './photo-add-dialog.component';

describe('PhotoAddDialogComponent', () => {
  let component: PhotoAddDialogComponent;
  let fixture: ComponentFixture<PhotoAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotoAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

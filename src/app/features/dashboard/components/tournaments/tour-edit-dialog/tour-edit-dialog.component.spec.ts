import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourEditDialogComponent } from './tour-edit-dialog.component';

describe('TourEditDialogComponent', () => {
  let component: TourEditDialogComponent;
  let fixture: ComponentFixture<TourEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

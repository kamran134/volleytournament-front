import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolEditingDialogComponent } from './school-editing-dialog.component';

describe('SchoolEditingComponent', () => {
  let component: SchoolEditingDialogComponent;
  let fixture: ComponentFixture<SchoolEditingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolEditingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

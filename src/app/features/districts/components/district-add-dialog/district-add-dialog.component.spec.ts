import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictAddDialogComponent } from './district-add-dialog.component';

describe('DistrictAddDialogComponent', () => {
  let component: DistrictAddDialogComponent;
  let fixture: ComponentFixture<DistrictAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

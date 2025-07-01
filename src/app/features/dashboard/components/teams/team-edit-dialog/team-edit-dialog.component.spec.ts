import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditDialogComponent } from './team-edit-dialog.component';

describe('TeamEditDialogComponent', () => {
  let component: TeamEditDialogComponent;
  let fixture: ComponentFixture<TeamEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

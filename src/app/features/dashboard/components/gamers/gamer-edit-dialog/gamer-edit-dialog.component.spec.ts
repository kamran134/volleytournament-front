import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamerEditDialogComponent } from './gamer-edit-dialog.component';

describe('GamerEditDialogComponent', () => {
  let component: GamerEditDialogComponent;
  let fixture: ComponentFixture<GamerEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamerEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamerEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

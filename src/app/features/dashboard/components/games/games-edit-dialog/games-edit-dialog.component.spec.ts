import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesEditDialogComponent } from './games-edit-dialog.component';

describe('GamesEditDialogComponent', () => {
  let component: GamesEditDialogComponent;
  let fixture: ComponentFixture<GamesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

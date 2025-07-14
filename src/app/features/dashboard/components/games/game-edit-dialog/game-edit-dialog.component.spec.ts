import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEditDialogComponent } from './game-edit-dialog.component';

describe('GamesEditDialogComponent', () => {
  let component: GameEditDialogComponent;
  let fixture: ComponentFixture<GameEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamersComponent } from './gamers.component';

describe('GamersComponent', () => {
  let component: GamersComponent;
  let fixture: ComponentFixture<GamersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

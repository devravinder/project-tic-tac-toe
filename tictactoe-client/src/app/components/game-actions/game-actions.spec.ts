import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameActions } from './game-actions';

describe('GameActions', () => {
  let component: GameActions;
  let fixture: ComponentFixture<GameActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameActions],
    }).compileComponents();

    fixture = TestBed.createComponent(GameActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

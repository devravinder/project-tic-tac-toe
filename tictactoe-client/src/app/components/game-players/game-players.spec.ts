import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayers } from './game-players';

describe('GamePlayers', () => {
  let component: GamePlayers;
  let fixture: ComponentFixture<GamePlayers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayers],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlayers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

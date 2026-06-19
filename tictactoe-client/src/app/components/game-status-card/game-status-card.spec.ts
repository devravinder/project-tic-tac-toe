import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusCard } from './game-status-card';

describe('GameStatusCard', () => {
  let component: GameStatusCard;
  let fixture: ComponentFixture<GameStatusCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStatusCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GameStatusCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

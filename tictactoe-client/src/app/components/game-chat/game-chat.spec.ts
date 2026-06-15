import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameChat } from './game-chat';

describe('GameChat', () => {
  let component: GameChat;
  let fixture: ComponentFixture<GameChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameChat],
    }).compileComponents();

    fixture = TestBed.createComponent(GameChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

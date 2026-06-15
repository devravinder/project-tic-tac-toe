import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerName } from './player-name';

describe('PlayerName', () => {
  let component: PlayerName;
  let fixture: ComponentFixture<PlayerName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerName],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

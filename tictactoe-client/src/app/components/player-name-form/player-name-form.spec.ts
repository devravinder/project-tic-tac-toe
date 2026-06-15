import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNameForm } from './player-name-form';

describe('PlayerNameForm', () => {
  let component: PlayerNameForm;
  let fixture: ComponentFixture<PlayerNameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerNameForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerNameForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

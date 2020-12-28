import { TestBed } from '@angular/core/testing';

import { StatePageGuard } from './state-page.guard';

describe('StatePageGuard', () => {
  let guard: StatePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StatePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

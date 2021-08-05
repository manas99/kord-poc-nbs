import { TestBed } from '@angular/core/testing';

import { NearWalletCheckGuard } from './near-wallet-check.guard';

describe('NearWalletCheckGuard', () => {
  let guard: NearWalletCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NearWalletCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

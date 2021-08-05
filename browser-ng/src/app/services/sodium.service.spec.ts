import { TestBed } from '@angular/core/testing';

import { SodiumService } from './sodium.service';

describe('SodiumService', () => {
  let service: SodiumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SodiumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

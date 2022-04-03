import { TestBed } from '@angular/core/testing';

import { ConcentratorsService } from './concentrators.service';

describe('ConcentratorsService', () => {
  let service: ConcentratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcentratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

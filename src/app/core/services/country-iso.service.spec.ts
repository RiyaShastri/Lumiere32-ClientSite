import { TestBed } from '@angular/core/testing';

import { CountryIsoService } from './country-iso.service';

describe('CountryIsoService', () => {
  let service: CountryIsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryIsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

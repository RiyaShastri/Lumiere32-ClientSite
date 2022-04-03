import { TestBed } from '@angular/core/testing';

import { CategoriesListService } from './categories-list.service';

describe('CategoriesListService', () => {
  let service: CategoriesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

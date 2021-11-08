import { TestBed } from '@angular/core/testing';

import { CareService } from './care.service';

describe('CareService', () => {
  let service: CareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

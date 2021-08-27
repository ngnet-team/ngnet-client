import { TestBed } from '@angular/core/testing';
import { NotLoggedGuardService } from './not-logged-guard.service';

describe('LoggedGuardService', () => {
  let service: NotLoggedGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotLoggedGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

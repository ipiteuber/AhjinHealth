import { TestBed } from '@angular/core/testing';

import { DatabaseInitService } from './database-init.service';

describe('DatabaseInitService', () => {
  let service: DatabaseInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

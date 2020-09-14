import { TestBed, inject } from '@angular/core/testing';

import { HttpCommService } from './http-comm.service';

describe('HttpCommService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCommService]
    });
  });

  it('should be created', inject([HttpCommService], (service: HttpCommService) => {
    expect(service).toBeTruthy();
  }));
});

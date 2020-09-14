import { TestBed, inject } from '@angular/core/testing';

import { GetResBCService } from './get-res-bc.service';

describe('GetResBCService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetResBCService]
    });
  });

  it('should be created', inject([GetResBCService], (service: GetResBCService) => {
    expect(service).toBeTruthy();
  }));
});

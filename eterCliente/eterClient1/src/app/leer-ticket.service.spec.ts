import { TestBed, inject } from '@angular/core/testing';

import { LeerTicketService } from './leer-ticket.service';

describe('LeerTicketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeerTicketService]
    });
  });

  it('should be created', inject([LeerTicketService], (service: LeerTicketService) => {
    expect(service).toBeTruthy();
  }));
});

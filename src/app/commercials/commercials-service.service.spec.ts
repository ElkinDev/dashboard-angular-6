import { TestBed, inject } from '@angular/core/testing';

import { CommercialsServiceService } from './commercials-service.service';

describe('CommercialsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommercialsServiceService]
    });
  });

  it('should be created', inject([CommercialsServiceService], (service: CommercialsServiceService) => {
    expect(service).toBeTruthy();
  }));
});

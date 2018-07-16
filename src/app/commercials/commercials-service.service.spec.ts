import { TestBed, inject } from '@angular/core/testing';

import { CommercialsService } from './commercials-service.service';

describe('CommercialsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommercialsService]
    });
  });

  it('should be created', inject([CommercialsService], (service: CommercialsService) => {
    expect(service).toBeTruthy();
  }));
});

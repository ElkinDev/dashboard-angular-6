import { TestBed, inject } from '@angular/core/testing';

import { AuditorService } from './auditor.service';

describe('AuditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditorService]
    });
  });

  it('should be created', inject([AuditorService], (service: AuditorService) => {
    expect(service).toBeTruthy();
  }));
});

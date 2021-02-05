import { TestBed } from '@angular/core/testing';

import { RegisterPractitionerDataService } from './register-practitioner-data.service';

describe('CreatePractitionerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterPractitionerDataService = TestBed.get(RegisterPractitionerDataService);
    expect(service).toBeTruthy();
  });
});

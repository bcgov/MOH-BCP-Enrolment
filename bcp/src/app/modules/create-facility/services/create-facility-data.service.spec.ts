import { TestBed } from '@angular/core/testing';

import { CreateFacilityDataService } from './create-facility-data.service';

describe('CreateFacilityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateFacilityDataService = TestBed.get(CreateFacilityDataService);
    expect(service).toBeTruthy();
  });
});

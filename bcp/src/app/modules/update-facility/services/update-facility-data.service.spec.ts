import { TestBed } from '@angular/core/testing';

import { UpdateFacilityDataService } from './update-facility-data.service';

describe('UpdateFacilityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateFacilityDataService = TestBed.get(UpdateFacilityDataService);
    expect(service).toBeTruthy();
  });
});

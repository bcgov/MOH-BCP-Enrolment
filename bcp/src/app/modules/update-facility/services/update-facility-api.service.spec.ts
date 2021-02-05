import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateFacilityApiService } from './update-facility-api.service';

describe('UpdateFacilityApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: UpdateFacilityApiService = TestBed.get(UpdateFacilityApiService);
    expect(service).toBeTruthy();
  });
});

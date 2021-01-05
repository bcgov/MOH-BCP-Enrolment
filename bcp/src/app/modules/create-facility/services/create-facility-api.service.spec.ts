import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateFacilityApiService } from './create-facility-api.service';

describe('CreateFacilityApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: CreateFacilityApiService = TestBed.get(CreateFacilityApiService);
    expect(service).toBeTruthy();
  });
});

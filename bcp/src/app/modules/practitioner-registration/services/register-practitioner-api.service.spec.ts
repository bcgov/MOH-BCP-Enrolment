import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RegisterPractitionerApiService } from './register-practitioner-api.service';

describe('RegisterPractitionerApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: RegisterPractitionerApiService = TestBed.get(RegisterPractitionerApiService);
    expect(service).toBeTruthy();
  });
});

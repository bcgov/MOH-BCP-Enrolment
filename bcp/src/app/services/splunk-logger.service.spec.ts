import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SplunkLoggerService } from './splunk-logger.service';

describe('SplunkLoggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: SplunkLoggerService = TestBed.get(SplunkLoggerService);
    expect(service).toBeTruthy();
  });
});

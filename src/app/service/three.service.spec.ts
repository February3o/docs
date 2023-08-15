import { TestBed } from '@angular/core/testing';

import { ThreeServiceService } from './three.service';

describe('ThreeServiceService', () => {
  let service: ThreeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

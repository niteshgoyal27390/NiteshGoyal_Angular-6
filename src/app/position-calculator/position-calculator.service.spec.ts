import { TestBed, inject } from '@angular/core/testing';

import { PositionCalculatorService } from './position-calculator.service';

describe('PositionCalculatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionCalculatorService]
    });
  });

  it('should be created', inject([PositionCalculatorService], (service: PositionCalculatorService) => {
    expect(service).toBeTruthy();
  }));
});

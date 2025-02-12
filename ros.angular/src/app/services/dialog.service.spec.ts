import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';

describe('Dialog Service:', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

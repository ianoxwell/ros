import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { ReferenceService } from '@services/reference.service';
import { StateService } from '@services/state.service';
import { autoSpy, Spy } from '@tests/auto-spy';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const referenceServiceSpy: Spy<ReferenceService> = autoSpy(ReferenceService);
  referenceServiceSpy.getAllReferences.and.returnValue(of());
  const stateServiceSpy: Spy<StateService> = autoSpy(StateService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatToolbarModule,
        MatSliderModule,
        NoopAnimationsModule
      ],
      declarations: [SearchBarComponent, MockComponent(PaginatorComponent)],
      providers: [
        { provide: ReferenceService, useValue: referenceServiceSpy },
        { provider: StateService, useValue: stateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

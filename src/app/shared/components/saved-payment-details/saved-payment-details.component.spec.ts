import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPaymentDetailsComponent } from './saved-payment-details.component';

describe('SavedPaymentDetailsComponent', () => {
  let component: SavedPaymentDetailsComponent;
  let fixture: ComponentFixture<SavedPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

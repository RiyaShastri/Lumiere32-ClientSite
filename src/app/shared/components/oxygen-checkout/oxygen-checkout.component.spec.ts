import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OxygenCheckoutComponent } from './oxygen-checkout.component';

describe('OxygenCheckoutComponent', () => {
  let component: OxygenCheckoutComponent;
  let fixture: ComponentFixture<OxygenCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OxygenCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OxygenCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

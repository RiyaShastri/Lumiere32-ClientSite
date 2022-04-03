import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellOnLumiereComponent } from './sell-on-lumiere.component';

describe('SellOnLumiereComponent', () => {
  let component: SellOnLumiereComponent;
  let fixture: ComponentFixture<SellOnLumiereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellOnLumiereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellOnLumiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

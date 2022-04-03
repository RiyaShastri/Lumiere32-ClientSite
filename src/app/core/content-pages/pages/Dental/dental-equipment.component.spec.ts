import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalEquipmentComponent } from './dental-equipment.component';

describe('DentalEquipmentComponent', () => {
  let component: DentalEquipmentComponent;
  let fixture: ComponentFixture<DentalEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DentalEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

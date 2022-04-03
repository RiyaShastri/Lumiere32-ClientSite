import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalEquipmentComponent } from './medical-equipment.component';

describe('MedicalEquipmentComponent', () => {
  let component: MedicalEquipmentComponent;
  let fixture: ComponentFixture<MedicalEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

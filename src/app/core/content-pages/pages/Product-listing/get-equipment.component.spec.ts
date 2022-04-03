import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEquipmentComponent } from './get-equipment.component';

describe('GetEquipmentComponent', () => {
  let component: GetEquipmentComponent;
  let fixture: ComponentFixture<GetEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

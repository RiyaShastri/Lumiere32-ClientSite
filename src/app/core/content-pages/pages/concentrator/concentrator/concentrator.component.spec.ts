import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentratorComponent } from './concentrator.component';

describe('ConcentratorComponent', () => {
  let component: ConcentratorComponent;
  let fixture: ComponentFixture<ConcentratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcentratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

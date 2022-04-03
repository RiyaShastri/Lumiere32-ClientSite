import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailpageComponent } from './failpage.component';

describe('FailpageComponent', () => {
  let component: FailpageComponent;
  let fixture: ComponentFixture<FailpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

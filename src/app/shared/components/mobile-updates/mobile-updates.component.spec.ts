import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUpdatesComponent } from './mobile-updates.component';

describe('MobileUpdatesComponent', () => {
  let component: MobileUpdatesComponent;
  let fixture: ComponentFixture<MobileUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

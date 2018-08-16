import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvocesCustomerComponent } from './invoces-customer.component';

describe('InvocesCustomerComponent', () => {
  let component: InvocesCustomerComponent;
  let fixture: ComponentFixture<InvocesCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvocesCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvocesCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPeopleComponent } from './customers-people.component';

describe('CustomersPeopleComponent', () => {
  let component: CustomersPeopleComponent;
  let fixture: ComponentFixture<CustomersPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

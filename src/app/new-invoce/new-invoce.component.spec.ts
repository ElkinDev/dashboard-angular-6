import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoceComponent } from './new-invoce.component';

describe('NewInvoceComponent', () => {
  let component: NewInvoceComponent;
  let fixture: ComponentFixture<NewInvoceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewInvoceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInvoceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

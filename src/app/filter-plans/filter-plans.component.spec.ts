import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPlansComponent } from './filter-plans.component';

describe('FilterPlansComponent', () => {
  let component: FilterPlansComponent;
  let fixture: ComponentFixture<FilterPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

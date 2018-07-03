import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAsideComponent } from './navbar-aside.component';

describe('NavbarAsideComponent', () => {
  let component: NavbarAsideComponent;
  let fixture: ComponentFixture<NavbarAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

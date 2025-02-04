import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContaComponent } from './admin-conta.component';

describe('AdminContaComponent', () => {
  let component: AdminContaComponent;
  let fixture: ComponentFixture<AdminContaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminContaComponent]
    });
    fixture = TestBed.createComponent(AdminContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

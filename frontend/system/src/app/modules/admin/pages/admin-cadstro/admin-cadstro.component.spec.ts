import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCadstroComponent } from './admin-cadstro.component';

describe('AdminCadstroComponent', () => {
  let component: AdminCadstroComponent;
  let fixture: ComponentFixture<AdminCadstroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCadstroComponent]
    });
    fixture = TestBed.createComponent(AdminCadstroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosComponent } from './admin-pedidos.component';

describe('AdminPedidosComponent', () => {
  let component: AdminPedidosComponent;
  let fixture: ComponentFixture<AdminPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPedidosComponent]
    });
    fixture = TestBed.createComponent(AdminPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

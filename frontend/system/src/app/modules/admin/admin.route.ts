import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAppComponent } from './admin.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminContaComponent } from './pages/admin-conta/admin-conta.component';
import { AdminMovimentacoesComponent } from './pages/admin-movimentacoes/admin-movimentacoes.component';


const AdminRoutingConfig: Routes = [
  {
    path: '', component: AdminAppComponent,
    children: [
      { path: 'home', component: AdminHomeComponent},
      { path: 'financeiro/movimentos', component: AdminMovimentacoesComponent},
      { path: 'financeiro/contas', component: AdminContaComponent},

    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(AdminRoutingConfig)
  ],
  exports: [RouterModule]
})

export class AdminRoutingModule{}

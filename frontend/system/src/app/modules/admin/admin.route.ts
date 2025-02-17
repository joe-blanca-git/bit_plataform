import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAppComponent } from './admin.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminContaComponent } from './pages/admin-financeiro/admin-conta/admin-conta.component';
import { AdminMovimentacoesComponent } from './pages/admin-financeiro/admin-movimentacoes/admin-movimentacoes.component';
import { AuthGuardService } from 'src/app/shared/services/auth.service';
import { AdminFluxoComponent } from './pages/admin-financeiro/admin-fluxo/admin-fluxo.component';
import { AdminShopHomeComponent } from './pages/admin-comercial/shop/home/admin-shop-home/admin-shop-home.component';
import { AdminPedidosComponent } from './pages/admin-comercial/admin-pedidos/admin-pedidos.component';
import { AdminCadastroPessoasComponent } from './pages/admin-cadastro/admin-cadastro-pessoas/admin-cadastro-pessoas.component';
import { AdminCadastroProdutosComponent } from './pages/admin-cadastro/admin-cadastro-produtos/admin-cadastro-produtos.component';


const AdminRoutingConfig: Routes = [
  {
    path: '', component: AdminAppComponent,
    children: [
      { path: 'home', component: AdminHomeComponent, canActivate: [AuthGuardService]},
      { path: 'financeiro/movimentos', component: AdminMovimentacoesComponent, canActivate: [AuthGuardService]},
      { path: 'financeiro/contas', component: AdminContaComponent, canActivate: [AuthGuardService]},
      { path: 'financeiro/fluxo', component: AdminFluxoComponent, canActivate: [AuthGuardService]},
      { path: 'register/accounts', component: AdminCadastroPessoasComponent, canActivate: [AuthGuardService]},
      { path: 'register/products', component: AdminCadastroProdutosComponent, canActivate: [AuthGuardService]},
      { path: 'shop/home', component: AdminShopHomeComponent, canActivate: [AuthGuardService]},
      { path: 'orders', component: AdminPedidosComponent, canActivate: [AuthGuardService]},
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

import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAppComponent } from './admin.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminContaComponent } from './pages/admin-conta/admin-conta.component';


const AdminRoutingConfig: Routes = [
  {
    path: '', component: AdminAppComponent,
    children: [
      { path: 'home', component: AdminHomeComponent},
      { path: 'contas', component: AdminContaComponent},
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

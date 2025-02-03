import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {
    path: 'admin',
      loadChildren: () => import('./modules/admin/admin.module')
       .then(m => m.AdminModule)
  },
  {
    path: 'login', component : LoginComponent
  },
  {
    path: '', component : LoginComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.route';
import { AdminAppComponent } from './admin.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SideMenuComponent } from './shared/components/layout/side-menu/side-menu.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { MovimentacoesComponent } from './shared/components/financeiro/movimentacoes/movimentacoes.component';
import { AdminContaComponent } from './pages/admin-conta/admin-conta.component';
import { AdminCadstroComponent } from './pages/admin-cadstro/admin-cadstro.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminMovimentacoesComponent } from './pages/admin-movimentacoes/admin-movimentacoes.component';
import { MovimentacoesGraficoAnoComponent } from './shared/components/financeiro/movimentacoes-grafico-ano/movimentacoes-grafico-ano.component';
import { PagamentosComponent } from './shared/components/financeiro/pagamentos/pagamentos.component';
import { NovoPagamentoComponent } from './shared/components/financeiro/novo-pagamento/novo-pagamento.component';

@NgModule({
  declarations: [
    AdminAppComponent,
    AdminHomeComponent,
    SideMenuComponent,
    FooterComponent,
    MovimentacoesComponent,
    AdminContaComponent,
    AdminCadstroComponent,
    AdminMovimentacoesComponent,
    MovimentacoesGraficoAnoComponent,
    PagamentosComponent,
    NovoPagamentoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzDatePickerModule,
    NzTableModule,
    NzSelectModule,
    NzDrawerModule,
    NzModalModule,
    NzStepsModule,
    NzTabsModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSpinModule,    
    NgxPaginationModule
    
  ]
})
export class AdminModule { }

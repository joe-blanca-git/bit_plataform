import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { ThemeService } from '../../../shared/services/themeService';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.scss'],
})
export class AdminPedidosComponent {

  theme: 'dark' | 'light' = 'light';

  isVisibleMenu = false;
  isVisiblePedido = true;
  isUpdate = false;

  totalVendas = 0;
  totalComrpas = 0;
  currentPage = 1;
  currentQtde = 5;
  type = 0;

  dataPedido: any;

  constructor(
    private themeService: ThemeService,
    private notification: NotificationService,
    private formateValueService: ValorFormatterService,
    private formateDateService: DataFormatterService,
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  loadPedidos(){
    
  }

  filtrarPedidos(event: Event): void {
    //   const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
    //   this.listaFiltrada = this.listMovimentacoes.filter(mov => {
    //     const tipoTexto = mov.Tipo === '1' ? 'receita' : 'despesa';
    //     return Object.values(mov).some(ValorTotal =>
    //       String(ValorTotal).toLowerCase().includes(input)
    //     ) || tipoTexto.includes(input);
    //   });
  }

  showMenu() {
    this.isVisibleMenu = true;
  }

  showPedido(type: number){
    this.type = type;
    this.isVisiblePedido = true;
    this.handleOk();
  }

  cancelPedido(){
    this.handleCancel();
  }

  handleOk(): void {
    this.isVisibleMenu = false;
  }

  handleCancel(): void {
    this.isVisibleMenu = false;
    this.clear();
  }

  clear(){
    this.isVisiblePedido = false;
    this.type = 0;
  }

  changeQtde(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentQtde = Number(selectElement.value);
  }

  getHeader(): string {
    if (this.theme === 'dark') {
      return 'assets/img/bg/header-admin.png';
    } else {
      return 'assets/img/bg/header-admin-light.png';
    }
  }

  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date:any): string{
    return this.formateDateService.formatarData(date);
  }
}

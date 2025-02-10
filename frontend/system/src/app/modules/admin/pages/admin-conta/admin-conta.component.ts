import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovimentacoesService } from '../../shared/services/movimentacoes.service';
import { ThemeService } from '../../shared/services/themeService';
import { MovModel } from '../../shared/models/mov.model';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-conta',
  templateUrl: './admin-conta.component.html',
  styleUrls: ['./admin-conta.component.scss'],
})
export class AdminContaComponent {
  theme: 'dark' | 'light' = 'light';

  currentPage = 1;
  currentQtde = 5;
  totalReceber = 0;
  totalPagar = 0;
  saldoFuturo = 0;

    listMenuUser = [
      // {
      //   label: 'Registrar',
      //   icon: 'fa-money-bill-1-wave',
      //   class: 'btn-outline-primary',
      //   value: 'N'
      // }
    ];
  
    listMovimentacoes: MovModel[] = [];
  
    listaFiltrada:MovModel[] = [...this.listMovimentacoes];

  constructor(
    private themeService: ThemeService,
    private notification: NotificationService,
    private formateValueService: ValorFormatterService,
    private formateDateService: DataFormatterService,
    private movimentacoesService: MovimentacoesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.loadMovimentacoes();
  }

  recebeMov(data: any){
    console.log(data);
    
  }

  loadMovimentacoes(){
    this.movimentacoesService.getMov()?.subscribe({
      next: (v:any[]) => {
        
        
        this.listMovimentacoes = v.sort((a, b) => b.Id - a.Id).filter((i:any) => i.StatusConta === 'Pendente');
        this.listaFiltrada = [...this.listMovimentacoes];
        console.log(this.listaFiltrada);       
      },
      error: (e) => this.processarErro(e),
      complete: () => {this.calcTotais();} 
    });
  }

  filtrarMovimentacoes(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
  
    this.listaFiltrada = this.listMovimentacoes.filter(mov => {
      const tipoTexto = mov.Tipo === '1' ? 'receita' : 'despesa';
  
      return Object.values(mov).some(ValorTotal => 
        String(ValorTotal).toLowerCase().includes(input)
      ) || tipoTexto.includes(input);
    });
  }

  calcTotais(): void {   
    this.totalReceber = this.listMovimentacoes
      .filter(mov => mov.Tipo === '1')
      .reduce((acc, mov) => acc + mov.ValorTotal, 0);
  
    this.totalPagar = this.listMovimentacoes
      .filter(mov => mov.Tipo === '2')
      .reduce((acc, mov) => acc + mov.ValorTotal, 0);
  
    this.saldoFuturo = this.totalReceber - this.totalPagar;
  }

  changeQtde(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentQtde = Number(selectElement.value);
  }

  getTipo(id:string): string{
    if (id === '1') {
      return 'Receita'
    } else {
      return 'Despesa'
    }
  }

  getMenorDataPendente(parcelas: any[]): string {
    if (!parcelas || parcelas.length === 0) return 'Sem vencimento';
  
    const menorData = parcelas
      //.filter(p => p.StatusParcela === 'Pendente') 
      .map(p => moment(p.DataVencimento, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss'], true))
      .filter(date => date.isValid()) 
      .sort((a, b) => a.valueOf() - b.valueOf()) 
  
    return menorData.length === 0 
      ? 'Sem vencimento' 
      : menorData[0].format('DD/MM/YYYY'); 
  }

  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date:any): string{
    return this.formateDateService.formatarData(date);
  }

  getHeader(): string {
    if (this.theme === 'dark') {
      return 'assets/img/bg/header-admin.png';
    } else {
      return 'assets/img/bg/header-admin-light.png';
    }
  }

  processarErro(erro: any) {    
    if (erro.error) {
      if (erro.messages) {
        for (let e of erro.messages) {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            e
          );
        }
      }
    } else {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        erro
      );
    }
  }
}

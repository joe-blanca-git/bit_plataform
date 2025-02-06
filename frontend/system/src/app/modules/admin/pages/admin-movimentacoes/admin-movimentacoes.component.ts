import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ThemeService } from '../../shared/services/themeService';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { getISOWeek } from 'date-fns';


@Component({
  selector: 'app-admin-movimentacoes',
  templateUrl: './admin-movimentacoes.component.html',
  styleUrls: ['./admin-movimentacoes.component.scss'],
})
export class AdminMovimentacoesComponent {
  theme: 'dark' | 'light' = 'light';
  isVisible = false;
  isVisibleMov = false;
  catType = 1; //1 = simples, 2 = completa
  currentPage = 1;
  currentQtde = 5;
  totalReceita = 0;
  totalDespesa = 0;
  saldo = 0;

  listMenuUser = [
    {
      label: 'Registrar',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-primary',
      value: 'N'
    }
  ];

  listMovimentacoes = [
    {
      data_inc: '01/01/2024',
      tipo: 1,
      origem: 'Bit-Admin',
      origem_id: 1,
      pessoa: 'João Silva',
      pessoa_id: 21,
      descricao: 'Gastos com supermercados do final de semana',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 123123.00,
      parcels: [
        { data_venc: '01/01/2025', valor_parc: 12313.00, status: 'A' },
        { data_venc: '01/01/2025', valor_parc: 12313.00, status: 'P' },
      ]
    },
    {
      data_inc: '05/02/2024',
      tipo: 2,
      origem: 'Bit-Shop',
      origem_id: 2,
      pessoa: 'Maria Oliveira',
      pessoa_id: 34,
      descricao: 'Compra de material de escritório',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 500.00,
      parcels: [
        { data_venc: '05/03/2024', valor_parc: 250.00, status: 'A' },
        { data_venc: '05/04/2024', valor_parc: 250.00, status: 'P' },
      ]
    },
    {
      data_inc: '10/02/2024',
      tipo: 1,
      origem: 'Bit-Service',
      origem_id: 3,
      pessoa: 'Carlos Mendes',
      pessoa_id: 45,
      descricao: 'Pagamento de serviço de manutenção',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 800.00,
      parcels: [
        { data_venc: '10/03/2024', valor_parc: 800.00, status: 'A' },
      ]
    },
    {
      data_inc: '15/02/2024',
      tipo: 2,
      origem: 'Bit-Admin',
      origem_id: 1,
      pessoa: 'Fernanda Souza',
      pessoa_id: 56,
      descricao: 'Reembolso de despesas de viagem',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 1500.00,
      parcels: [
        { data_venc: '15/03/2024', valor_parc: 750.00, status: 'P' },
        { data_venc: '15/04/2024', valor_parc: 750.00, status: 'A' },
      ]
    },
    {
      data_inc: '20/02/2024',
      tipo: 1,
      origem: 'Bit-Shop',
      origem_id: 2,
      pessoa: 'Ricardo Lopes',
      pessoa_id: 67,
      descricao: 'Compra de equipamentos de informática',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 3200.00,
      parcels: [
        { data_venc: '20/03/2024', valor_parc: 1600.00, status: 'A' },
        { data_venc: '20/04/2024', valor_parc: 1600.00, status: 'P' },
      ]
    },
    {
      data_inc: '25/02/2024',
      tipo: 2,
      origem: 'Bit-Service',
      origem_id: 3,
      pessoa: 'Amanda Costa',
      pessoa_id: 78,
      descricao: 'Pagamento de consultoria',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 1000.00,
      parcels: [
        { data_venc: '25/03/2024', valor_parc: 500.00, status: 'A' },
        { data_venc: '25/04/2024', valor_parc: 500.00, status: 'P' },
      ]
    },
    {
      data_inc: '01/03/2024',
      tipo: 1,
      origem: 'Bit-Admin',
      origem_id: 1,
      pessoa: 'Luiz Fernando',
      pessoa_id: 89,
      descricao: 'Assinatura de software mensal',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 300.00,
      parcels: [
        { data_venc: '01/04/2024', valor_parc: 300.00, status: 'A' },
      ]
    },
    {
      data_inc: '05/03/2024',
      tipo: 2,
      origem: 'Bit-Shop',
      origem_id: 2,
      pessoa: 'Gabriela Martins',
      pessoa_id: 90,
      descricao: 'Compra de móveis para escritório',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 2500.00,
      parcels: [
        { data_venc: '05/04/2024', valor_parc: 1250.00, status: 'P' },
        { data_venc: '05/05/2024', valor_parc: 1250.00, status: 'A' },
      ]
    },
    {
      data_inc: '10/03/2024',
      tipo: 1,
      origem: 'Bit-Service',
      origem_id: 3,
      pessoa: 'Eduardo Lima',
      pessoa_id: 101,
      descricao: 'Manutenção de equipamentos',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 1200.00,
      parcels: [
        { data_venc: '10/04/2024', valor_parc: 600.00, status: 'A' },
        { data_venc: '10/05/2024', valor_parc: 600.00, status: 'P' },
      ]
    },
    {
      data_inc: '15/03/2024',
      tipo: 2,
      origem: 'Bit-Admin',
      origem_id: 1,
      pessoa: 'Patrícia Almeida',
      pessoa_id: 112,
      descricao: 'Despesas com evento corporativo',
      conta: 'Banco Inter',
      conta_id: 1,
      valor_total: 5000.00,
      parcels: [
        { data_venc: '15/04/2024', valor_parc: 2500.00, status: 'P' },
        { data_venc: '15/05/2024', valor_parc: 2500.00, status: 'A' },
      ]
    }
  ];

  listaFiltrada = [...this.listMovimentacoes];

  date = null;
  
  constructor(
    private themeService: ThemeService,
    private notification: NotificationService,
    private formateValueService: ValorFormatterService,
    private formateDateService: DataFormatterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.calcTotais();

  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }

  filtrarMovimentacoes(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
  
    this.listaFiltrada = this.listMovimentacoes.filter(mov => {
      const tipoTexto = mov.tipo === 1 ? 'receita' : 'despesa';
  
      return Object.values(mov).some(valor => 
        String(valor).toLowerCase().includes(input)
      ) || tipoTexto.includes(input);
    });
  }
  
  
  
  

  calcTotais(): void {
    this.totalReceita = this.listMovimentacoes
      .filter(mov => mov.tipo === 1)
      .reduce((acc, mov) => acc + mov.valor_total, 0);
  
    this.totalDespesa = this.listMovimentacoes
      .filter(mov => mov.tipo === 2)
      .reduce((acc, mov) => acc + mov.valor_total, 0);
  
    this.saldo = this.totalReceita - this.totalDespesa;
  }
  
  showMenu(label: any) {
    if (label === 'N') {
      this.isVisible = true;
    }
  }

  changeTheme() {
    this.themeService.changeTheme();
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

  getTipo(id:number): string{
    if (id === 1) {
      return 'Receita'
    } else {
      return 'Despesa'
    }
  }

  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date:string, abrev: boolean): string{
    return this.formateDateService.formatarData(date,abrev);
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ThemeService } from '../../../shared/services/themeService';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { getISOWeek } from 'date-fns';
import { MovimentacoesService } from '../../../shared/services/movimentacoes.service';
import { MovModel } from '../../../shared/models/mov.model';


@Component({
  selector: 'app-admin-movimentacoes',
  templateUrl: './admin-movimentacoes.component.html',
  styleUrls: ['./admin-movimentacoes.component.scss'],
})
export class AdminMovimentacoesComponent {
  theme: 'dark' | 'light' = 'light';
  isVisible = false;
  isVisibleMov = false;
  isVisibleGraf = false;
  isUpdate = false;
  catType = 1; //1 = simples, 2 = completa
  movType = ''; //1 = receita, 2 = despesa
  currentPage = 1;
  currentQtde = 5;
  totalReceita = 0;
  totalDespesa = 0;
  saldo = 0;
  totalReceber = 0;
  totalPagar = 0;
  previsto = 0;

  listMenuUser = [
    {
      label: 'Registrar',
      icon: 'fa-money-bill-1-wave',
      class: 'btn-outline-primary',
      value: 'N'
    }
  ];

  listMovimentacoes: MovModel[] = [];

  listaFiltrada:MovModel[] = [...this.listMovimentacoes];

  date = null;

  dataForUpdate: any;
  
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

  loadMovimentacoes(){
    this.movimentacoesService.getMov()?.subscribe({
      next: (v:any[]) => {
        this.listMovimentacoes = v.sort((a, b) => b.Id - a.Id);
        this.listaFiltrada = [...this.listMovimentacoes];       
      },
      error: (e) => this.processarErro(e),
      complete: () => {this.calcTotais();} 
    });
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
      const tipoTexto = mov.Tipo === '1' ? 'receita' : 'despesa';
  
      return Object.values(mov).some(ValorTotal => 
        String(ValorTotal).toLowerCase().includes(input)
      ) || tipoTexto.includes(input);
    });
  }

  calcTotais(): void {   
    this.totalReceita = this.listMovimentacoes
      .filter(mov => mov.Tipo === '1')
      .reduce((acc, mov) => acc + mov.ValorPago, 0);
  
    this.totalDespesa = this.listMovimentacoes
      .filter(mov => mov.Tipo === '2')
      .reduce((acc, mov) => acc + mov.ValorPago, 0);

    this.totalReceber = this.listMovimentacoes
      .filter(mov => mov.Tipo === '1')
      .reduce((acc, mov) => acc + mov.ValorPendente, 0);

    this.totalPagar = this.listMovimentacoes
      .filter(mov => mov.Tipo === '2')
      .reduce((acc, mov) => acc + mov.ValorPendente, 0);
  
    this.saldo = this.totalReceita - this.totalDespesa;
    this.previsto = this.totalReceber - this.totalPagar;
  }

  deleteMov(idMov: number): void {   
    if (idMov) {
      this.movimentacoesService.deleteNewMov(idMov).subscribe({
        next: (response) => {
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            response.message
          );
          this.loadMovimentacoes();
        },
        error: (error) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            error.error
          );
        },
        complete: () => {
          this.isVisible = false;
        },
      });
    }
  }

  showUpdate(typeMov: string, data:any){
    this.movType = typeMov;
    this.catType = 2;
    this.isUpdate = true;
    this.dataForUpdate = data;
    this.isVisibleMov = true;
    
  }

  showMov(cat: number){
    this.catType = cat;
    this.isVisibleMov = true;
    this.handleOk();
  }
  
  showMenu(label: any) {
    if (label === 'N') {
      this.isVisible = true;
    }
  }

  closeMov(event: boolean){
    if (!event) {
      this.clearVariables();
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

  getTipo(id:string): string{
    if (id === '1') {
      return 'Receita'
    } else {
      return 'Despesa'
    }
  }

  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date:any): string{
    return this.formateDateService.formatarData(date);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearVariables();
  }

  clearVariables(){
    this.catType = 0;
    this.isVisibleMov = false;
    this.isUpdate = false;
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

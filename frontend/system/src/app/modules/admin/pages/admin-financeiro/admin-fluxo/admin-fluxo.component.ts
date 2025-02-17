import { Component } from '@angular/core';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovimentacoesService } from '../../../shared/services/movimentacoes.service';
import { ThemeService } from '../../../shared/services/themeService';
import { MovModel } from '../../../shared/models/mov.model';
import * as moment from 'moment';
import { FluxoService } from '../../../shared/services/fluxo.service';
import { FluxoModel } from '../../../shared/models/fluxo.model';

@Component({
  selector: 'app-admin-fluxo',
  templateUrl: './admin-fluxo.component.html',
  styleUrls: ['./admin-fluxo.component.scss']
})
export class AdminFluxoComponent {

  theme: 'dark' | 'light' = 'light';

  receitaAcumulada = 0;
  despesaAcumulada = 0;
  resultadoAcumulado = 0;

  listaParemetros =[
    {
      name: 'Saldo Inicial'
    },
    {
      name: 'Receitas'
    },
    {
      name: 'Despesas'
    },
    {
      name: 'Resultado Mensal'
    },
    {
      name: 'Resultado Acumulado'
    }
  ]
  listMovimentacoes: MovModel[] = [];
  listFluxo: FluxoModel[]= [];
  listaFiltrada:MovModel[] = [...this.listMovimentacoes];

    constructor(
      private themeService: ThemeService,
      private notification: NotificationService,
      private formateValueService: ValorFormatterService,
      private formateDateService: DataFormatterService,
      private movimentacoesService: MovimentacoesService,
      private fluxoService: FluxoService
    ) {}

    ngOnInit(): void {
      this.themeService.theme$.subscribe((theme) => {
        this.theme = theme;
      });
  
      this.loadMovimentacoes();
      this.loadFluxo();
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

    loadFluxo(){
      this.fluxoService.getFluxo()?.subscribe({
        next: (v:any[]) => {
          this.listFluxo = v;
        },
        error: (e) => this.processarErro(e),
        complete: () => {this.calcTotais();} 
      })
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

    formatValor(valor:number){
      return this.formateValueService.formatarValor(valor);
    }
  
    formatData(date:any): string{
          if (!date) return 'Data inválida';
      
          const daten = moment(date, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss'], true);
      
          if (!daten.isValid()) return 'Data inválida'; 
      
          return daten.locale('pt-br').format('MMMM');
    }

    calcTotais(): void {   
      this.receitaAcumulada = this.listFluxo
        .reduce((acc, fluxo) => acc + fluxo.receitas, 0);

      this.despesaAcumulada = this.listFluxo
        .reduce((acc, fluxo) => acc + fluxo.despesas, 0);

      this.resultadoAcumulado = this.listFluxo
        .reduce((acc, fluxo) => acc + fluxo.resultado, 0);
    

    }

}

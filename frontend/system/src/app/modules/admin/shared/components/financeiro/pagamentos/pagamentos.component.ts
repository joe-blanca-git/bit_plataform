import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ClienteService } from '../../../services/cliente.service';
import { ListaService } from '../../../services/lista.service';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { ThemeService } from '../../../services/themeService';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovModel } from '../../../models/mov.model';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
})
export class PagamentosComponent {
  @Input('statusModal') isVisible: boolean = false;
  @Input('dadoPagamento') dadoPagamento!: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<boolean>();

  theme: 'dark' | 'light' = 'dark';

  isVisibleNovoPagamento = false;
  dadosNovoPagamento : any;

  currentQtde = 10;
  currentPage = 1;

  constructor(
    private themeService: ThemeService,
    private _fb: FormBuilder,
    private notification: NotificationService,
    private movimentacoesService: MovimentacoesService,
    private formateDateService: DataFormatterService,
    private formateValueService: ValorFormatterService
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
  }

  novoPagamento(data: any){    
    this.dadosNovoPagamento = data;
    this.showNovoPagamento();
  }

  refreshMovimentacao() {
    this.movimentacoesService.getMovId(Number(this.dadosNovoPagamento.IdMovimento))?.subscribe({
      next: (v: any[]) => { 
        if (v.length > 0 && v[0].Parcelas) {
          this.dadoPagamento.Parcelas = v[0].Parcelas;
        } else {
          this.dadoPagamento.Parcelas  = [];
        }
      },
      error: (e) => this.processarErro(e),
    });
  }
  
  showNovoPagamento(){
    this.isVisibleNovoPagamento = true;
  }

  closeNovoPagamento(){
    this.isVisibleNovoPagamento = false;
  }

  handleOk(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  handleCancel(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  clear() {}

  processarErro(erro: any) {
    if (erro.error) {
      if (erro.error.errors.Mensagens) {
        for (let e of erro.error.errors.Mensagens) {
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

  getTipo(id: string): string {
    if (id === '1') {
      return 'Receita';
    } else {
      return 'Despesa';
    }
  }

  formatData(date: any): string {
    return this.formateDateService.formatarData(date);
  }

  formatValor(valor: number) {
    return this.formateValueService.formatarValor(valor);
  }
}

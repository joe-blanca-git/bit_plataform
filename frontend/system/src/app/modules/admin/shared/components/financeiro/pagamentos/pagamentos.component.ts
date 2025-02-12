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

  currentQtde = 10;
  currentPage = 1;

  listParcelas = [];

  constructor(
    private themeService: ThemeService,
    private _fb: FormBuilder,
    private notification: NotificationService,
    private router: Router,
    private listaService: ListaService,
    private clienteService: ClienteService,
    private movimentacoesService: MovimentacoesService,
    private formateDateService: DataFormatterService,
    private formateValueService: ValorFormatterService
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
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

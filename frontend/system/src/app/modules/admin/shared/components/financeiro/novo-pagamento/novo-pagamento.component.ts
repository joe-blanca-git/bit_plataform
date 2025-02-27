import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { ThemeService } from '../../../services/themeService';
import { PagamentosService } from '../../../services/pagamentos.service';

@Component({
  selector: 'app-novo-pagamento',
  templateUrl: './novo-pagamento.component.html',
  styleUrls: ['./novo-pagamento.component.scss']
})
export class NovoPagamentoComponent {
    @Input('statusModal') isVisible: boolean = true;
    @Input('dadoPagamento') dadoPagamento!: any;
    @Output() closeEvent = new EventEmitter<boolean>();
    @Output() saveSuccess = new EventEmitter<boolean>();
  
    theme: 'dark' | 'light' = 'dark';

    novoPagamentoForm: FormGroup;

    isFormaPgtoInvalid = false;

      constructor(
        private themeService: ThemeService,
        private _fb: FormBuilder,
        private notification: NotificationService,
        private formateDateService: DataFormatterService,
        private formateValueService: ValorFormatterService,
        private pagamentosService: PagamentosService
      ) {
        this.novoPagamentoForm = this._fb.group({
          Valor: [null, Validators.required],
          options: [null, Validators.required]
        });        
      }

    ngOnInit(): void {
      this.themeService.theme$.subscribe((theme) => {
        this.theme = theme;
      });
      
    }

    registrarPagamento(){
      const formaPgto = this.novoPagamentoForm.get('options')?.value;
      const valor = this.novoPagamentoForm.get('Valor')?.value;

      if (!formaPgto) {
        this.isFormaPgtoInvalid = true;
        this.novoPagamentoForm.markAllAsTouched();
        this.notification.createBasicNotification('warning', 'bg-warning', 'text-danger', 'Selecione uma forma de pagamento.')
        return;
      }

      if (!valor) {
        this.novoPagamentoForm.markAllAsTouched();
        this.notification.createBasicNotification('warning', 'bg-warning', 'text-danger', 'Valor do registro é obrigatório!')
        return;
      }
      
      const bodyJson = {
        valor: valor,
        forma: Number(formaPgto),
        id_mov: this.dadoPagamento.IdMovimento,
        id_parcela: this.dadoPagamento.IdParcela
      }      

      this.pagamentosService.postNewMovPag(bodyJson).subscribe({
        next: (response) => {
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            response.message
          );
          this.saveSuccess.emit(true);
        },
        error: (error) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            error.error
          );
          this.saveSuccess.emit(false);
        },
        complete: () => {
          this.novoPagamentoForm.reset();
          this.isVisible = false;
          this.closeEvent.emit(false);
        },
      })
      
    }

    onChangeFormaPagto(event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target) {
        this.isFormaPgtoInvalid = false;
        this.novoPagamentoForm.markAsUntouched();
      }
    }

    handleOk(): void {
      this.clear();
      this.closeEvent.emit(false);
    }
  
    handleCancel(): void {
      this.clear();
      this.closeEvent.emit(false);
    }

    isInvalid(controlName: string): boolean {
      const control = this.novoPagamentoForm.get(controlName);
      return (
        (control?.invalid ?? false) &&
        ((control?.dirty ?? false) || (control?.touched ?? false))
      );
      return false;
    }

    formatData(date: any): string {
      return this.formateDateService.formatarData(date);
    }
  
    formatValor(valor: number) {
      return this.formateValueService.formatarValor(valor);
    }
  
    clear() {}
}

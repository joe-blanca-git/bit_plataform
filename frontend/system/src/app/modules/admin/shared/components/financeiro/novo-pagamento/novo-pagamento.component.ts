import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { ThemeService } from '../../../services/themeService';

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

      constructor(
        private themeService: ThemeService,
        private _fb: FormBuilder,
        private notification: NotificationService,
        private movimentacoesService: MovimentacoesService,
        private formateDateService: DataFormatterService,
        private formateValueService: ValorFormatterService
      ) {}

    ngOnInit(): void {
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
}

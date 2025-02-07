import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { MovimentacoesService } from '../../shared/services/movimentacoes.service';
import { ThemeService } from '../../shared/services/themeService';
import { MovModel } from '../../shared/models/mov.model';

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

    //this.loadMovimentacoes();
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


  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  getHeader(): string {
    if (this.theme === 'dark') {
      return 'assets/img/bg/header-admin.png';
    } else {
      return 'assets/img/bg/header-admin-light.png';
    }
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { ThemeService } from '../../shared/services/themeService';

@Component({
  selector: 'app-admin-estoque',
  templateUrl: './admin-estoque.component.html',
  styleUrls: ['./admin-estoque.component.scss']
})
export class AdminEstoqueComponent {

    theme: 'dark' | 'light' = 'light';
  
    selectedValue = null;
    radioValue = '1';
    currentPage = 1;
    currentQtde = 5;
  
    produtosTotal = 0;
    produtosAlerta = 0;
    produtosCritico = 0;
  
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
    }
  
    getHeader(): string {
      if (this.theme === 'dark') {
        return 'assets/img/bg/header-admin.png';
      } else {
        return 'assets/img/bg/header-admin-light.png';
      }
    }
  
    changeQtde(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      this.currentQtde = Number(selectElement.value);
    }
  
    filtrarEstoque(event: Event): void {
    //   const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    //   this.listaFiltrada = this.listMovimentacoes.filter(mov => {
    //     const tipoTexto = mov.Tipo === '1' ? 'receita' : 'despesa';
    
    //     return Object.values(mov).some(ValorTotal => 
    //       String(ValorTotal).toLowerCase().includes(input)
    //     ) || tipoTexto.includes(input);
    //   });
     }
}

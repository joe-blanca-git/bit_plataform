import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { ThemeService } from '../../../shared/services/themeService';
import { ClienteModel } from '../../../shared/models/cliente.model';
import { ClienteService } from '../../../shared/services/cliente.service';
import { FornecedorService } from '../../../shared/services/fornecedor.service';
import { ProdutoService } from '../../../shared/services/produto.service';
import { ProdutoModel } from '../../../shared/models/produto.model';
import { FornecedorModel } from '../../../shared/models/fornecedor.model';

@Component({
  selector: 'app-admin-cadastro-produtos',
  templateUrl: './admin-cadastro-produtos.component.html',
  styleUrls: ['./admin-cadastro-produtos.component.scss'],
})
export class AdminCadastroProdutosComponent {
  theme: 'dark' | 'light' = 'light';

  isVisibleNovo = false;

  selectedFornecedor = null;

  radioValue = '1';
  currentPage = 1;
  currentQtde = 5;

  produtosTotal = 0;
  produtosAlerta = 0;
  produtosCritico = 0;

  listProduto: ProdutoModel[] =[];
  listFornecedor: FornecedorModel[] = [];

  constructor(
    private themeService: ThemeService,
    private notification: NotificationService,
    private formateValueService: ValorFormatterService,
    private formateDateService: DataFormatterService,
    private router: Router,
    private route: ActivatedRoute,
    private fornecedoService: FornecedorService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
    this.loadData();
  }

  loadData(){
    this.loadFornecedor();
    this.loadProduto();
  }

  addPeople(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 4) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Nome da pessoa deve ter pelo menos 4 caractéres.'
      );
      return;
    }

    const people = {
      nome: _nome,
    };

    this.fornecedoService.postFornecedor(people).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );
        this.loadFornecedor();
      },
      error: (e) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          e.error
        );
      },
      complete: () => {},
    });
  }

  loadProduto(){
    this.produtoService.getProduto(null, null)?.subscribe({
      next: (v) => {
        this.listProduto = v;
        this.calcTotais();
      },
      error: (e) => this.processarErro(e),
    });
  }

  loadFornecedor() {
    this.fornecedoService.getFornecedor()?.subscribe({
      next: (v) => {
        this.listFornecedor = v;
      },
      error: (e) => this.processarErro(e),
    });
  }

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

  showNovoProduto(){
    this.isVisibleNovo = true;
  }

  closeNovoProduto(){
    this.isVisibleNovo = false;;
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

  formatValor(valor:number){
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date:any): string{
    return this.formateDateService.formatarData(date);
  }

  calcTotais(): void {   
    this.produtosTotal = this.listProduto.length;
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/themeService';
import { Router } from '@angular/router';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ClienteService } from '../../../services/cliente.service';
import { ListaService } from '../../../services/lista.service';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { ClienteModel } from '../../../models/cliente.model';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoModel } from '../../../models/produto.model';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent {
  @Input('statusModal') isVisible: boolean = false;
  @Input('typeMov') movType: number = 0;
  @Input('snUpdate') isUpdate: boolean = false;
  @Input('dataUpdate') dataUpdate!: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<boolean>();

  theme: 'dark' | 'light' = 'dark';
  updatingField: 'un' | 'emb' | null = null;

  pedidosForm: FormGroup;
  date: Date = new Date();

  fornecedorChecked = false;
  isVisiblePrazo = false;

  current = 0;
  index = 0;
  currentPage = 1;

  listClients: ClienteModel[] = [];
  listProduto: ProdutoModel[] = [];
  listSelectProduto: any[] = [];
  listFormaPagamento: any[] = [
    {
      id: 1,
      nome: 'Dinheiro',
    },
    {
      id: 2,
      nome: 'Cartão de Crédito',
    },
    {
      id: 3,
      nome: 'Cartão de Débito',
    },
    {
      id: 4,
      nome: 'Pix',
    },
    {
      id: 5,
      nome: 'Boleto Bancário',
    },
    {
      id: 6,
      nome: 'Transferência Bancária',
    },
    {
      id: 7,
      nome: 'Cheque',
    },
    {
      id: 8,
      nome: 'Vale Alimentação',
    },
    {
      id: 9,
      nome: 'Vale Refeição',
    },
    {
      id: 10,
      nome: 'Depósito',
    },
  ];
  listPrazo: any[] = [
    {
      id: 1,
      nome: 'Á vista'
    },
    {
      id: 2,
      nome: 'Pagamento Único'
    },
    {
      id: 3,
      nome: 'Pagamento Parcelado'
    }
  ];

  selectedClient = null;
  selectedProduto = null;
  selectedFormaPagamento = null;
  selectedPrazo = null;

  constructor(
    private themeService: ThemeService,
    private _fb: FormBuilder,
    private notification: NotificationService,
    private router: Router,
    private listaService: ListaService,
    private clienteService: ClienteService,
    private movimentacoesService: MovimentacoesService,
    private formateDateService: DataFormatterService,
    private formateValueService: ValorFormatterService,
    private produtoService: ProdutoService
  ) {
    this.pedidosForm = this._fb.group({
      Cliente: ['', Validators.required],
      Telefone: [''],
      Email: ['', [Validators.email]],
      Endereco: [''],
      Cidade: [''],
      DataEntrega: [''],
      Frete: [null],
      CustoExtra: [null],
      FormaPagamento: [''],
      Prazo: [''],
      EnderecoEntrega: [''],
      CidadeEntrega: [''],
      Observacao: [''],
      Produto: [''],
      ValorProduto: [null],
      QtdeUn: [null],
      QtdeEmb: [null],
      CheckFornecedor: [false],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.loadCliente();
    this.loadProduto();
  }

  saveOrder() {
    if (this.pedidosForm.valid) {
      console.log(this.pedidosForm.value);
    } else {
      this.pedidosForm.markAllAsTouched();
      this.pedidosForm.markAsDirty();
    }
  }

  addProdutoList() {
    const produtoSelecionado = this.listProduto.find(
      (item) => item.id === this.selectedProduto
    );
    const qtdeUn = this.pedidosForm.get('QtdeUn')?.value;
    const valor = this.pedidosForm.get('ValorProduto')?.value;
    const valorTotal = qtdeUn * valor;

    if (produtoSelecionado && qtdeUn && valor) {
      const produtoExistente = this.listSelectProduto.find(
        (item) => item.id === produtoSelecionado.id
      );

      if (produtoExistente) {
        this.notification.createBasicNotification(
          'warning',
          'bg-warning',
          'text-dark',
          'Este produto já foi adicionado à lista!'
        );
        return;
      }

      const produtoAdicionado = {
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        qtdeUn: qtdeUn,
        valorUn: valor,
        valorTotal: valorTotal,
      };

      this.listSelectProduto.push(produtoAdicionado);

      this.notification.createBasicNotification(
        'success',
        'bg-success',
        'text-light',
        'Produto adicionado com sucesso!'
      );

      this.pedidosForm.patchValue({
        QtdeUn: null,
        ValorProduto: null,
        QtdeEmb: null,
      });

      this.selectedProduto = null;
    } else {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Preencha todas as informações para adicionar um produto à lista!'
      );
    }
  }

  removeProdutoList(produtoId: number) {
    this.listSelectProduto = this.listSelectProduto.filter(
      (item) => item.id !== produtoId
    );
  }

  filterFonecedor() {

  }

  selectPrazo(prazoId: any) {
    if (prazoId === 2) {
      this.isVisiblePrazo = true;
    }else{
      this.isVisiblePrazo = false;
    }
  }

  selectFormaPagamento(formaId: any) {
    console.log(formaId);
  }

  selectProduto(produtoId: any) {
    const listAux = this.listProduto.filter((i) => i.id === produtoId);
    const ValorProduto = listAux[0]?.valor_venda || null;
    const QtdeUn = listAux[0]?.qtde_embalagem * 1 || null;
    this.selectedProduto = produtoId;

    if (listAux) {
      this.pedidosForm.patchValue({
        ValorProduto: ValorProduto,
        QtdeUn: QtdeUn,
      });
    }
  }

  addProduto(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 4) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Nome do Produto deve ter pelo menos 4 caractéres.'
      );
      return;
    }

    const produto = {
      nome: _nome,
    };

    this.produtoService.postProduto(produto).subscribe({
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
          error.error.message
        );
      },
      complete: () => {},
    });
  }

  loadProduto() {
    this.produtoService.getProduto(null, null)?.subscribe({
      next: (v) => {
        this.listProduto = v;
      },
      error: (e) => this.processarErro(e),
    });
  }

  selectCliente(clienteId: any) {
    let listAux = this.listClients.filter((i) => i.id === clienteId);

    this.pedidosForm.patchValue({
      Telefone: listAux[0].contato,
      Email: listAux[0].email,
      Endereco: listAux[0].endereco,
      Cidade: listAux[0].cidade,
    });
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

    this.clienteService.postCliente(people).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );
        this.loadCliente();
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

  loadCliente() {
    this.clienteService.getCliente()?.subscribe({
      next: (v) => {
        this.listClients = v;
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

  getValue(field: string) :number{
    return  this.pedidosForm.get(field)?.value || 0;
  }

  getTotalPedido(listProdutos: any[]) {
    const valorTotal = listProdutos.reduce(
      (total, item) => total + (item.valorTotal || 0),
      0
    );
    const valorFrente = this.pedidosForm.get('Frete')?.value || 0;
    const valorCustos = this.pedidosForm.get('CustoExtra')?.value || 0;
    return valorTotal + valorFrente + valorCustos;
  }

  getTotalProduto(listProdutos: any[]): number {
    const valorTotal = listProdutos.reduce(
      (total, item) => total + (item.valorTotal || 0),
      0
    );
    return valorTotal;
  }

  getClienteName(idCliente: number) {
    if (idCliente) {
      var nameClient = this.listClients.filter((i) => i.id === idCliente)[0]
        .nome;
    } else {
      return;
    }
    return nameClient;
  }

  calcQtde(input: string) {
    if (this.updatingField === input) {
      return; // Evita a recursão infinita
    }

    if (this.selectedProduto) {
      let qtdeUn = this.pedidosForm.get('QtdeUn')?.value || 0;
      let qtdeEmb = this.pedidosForm.get('QtdeEmb')?.value || 0;
      let listAux = this.listProduto.filter(
        (i) => i.id === this.selectedProduto
      );
      let qtdeEmbDefault = listAux[0]?.qtde_embalagem || 0;

      if (input === 'un') {
        this.updatingField = 'emb';
        qtdeEmb = qtdeUn / qtdeEmbDefault;
        this.pedidosForm.patchValue({ QtdeEmb: qtdeEmb }, { emitEvent: false });
      } else if (input === 'emb') {
        this.updatingField = 'un';
        qtdeUn = qtdeEmb * qtdeEmbDefault;
        this.pedidosForm.patchValue({ QtdeUn: qtdeUn }, { emitEvent: false });
      }

      this.updatingField = null; // Reseta após atualização
    } else {
      this.notification.createBasicNotification(
        'warning',
        'bg-warning',
        'text-dark',
        'Selecione um produto para alterar a quantidade!'
      );
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 0;
        break;
      }
      case 1: {
        this.index = 1;
        break;
      }
      case 2: {
        this.index = 2;
        break;
      }
      case 3: {
        this.index = 3;
        break;
      }
      default: {
        this.index = 0;
      }
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

  clear() {}

  isInvalid(controlName: string): boolean {
    const control = this.pedidosForm.get(controlName);
    return (
      (control?.invalid ?? false) &&
      ((control?.dirty ?? false) || (control?.touched ?? false))
    );
  }

  formatValor(valor: number) {
    return this.formateValueService.formatarValor(valor);
  }

  formatData(date: any): string {
    return this.formateDateService.formatarDataComplete(date);
  }
}

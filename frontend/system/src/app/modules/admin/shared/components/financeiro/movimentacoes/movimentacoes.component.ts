import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ThemeService } from '../../../services/themeService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteModel } from '../../../models/cliente.model';
import { ListaModel } from '../../../models/lista.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { ListaService } from '../../../services/lista.service';
import { ClienteService } from '../../../services/cliente.service';
import * as moment from 'moment';
import { MovimentacoesService } from '../../../services/movimentacoes.service';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss'],
})
export class MovimentacoesComponent implements OnChanges {
  @Input('statusModal') isVisible: boolean = false;
  @Input('typeMov') movType: string = '';
  @Input('snUpdate') isUpdate: boolean = false;
  @Input('catMov') catType!: number;
  @Input('dataUpdate') dataUpdate!: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<boolean>();

  theme: 'dark' | 'light' = 'dark';

  cat = '';
  statusMov = 'P';

  isConfirmLoading = false;
  isSnParc = false;
  checkType = 1;

  index = 0;
  currentPage = 1;
  qtdeParcela = 1;

  listClientes: ClienteModel[] = [];
  listClientesFiltered: ClienteModel[] = [];
  listCategorias: ListaModel[] = [];
  listCategoriasFiltered: ListaModel[] = [];
  listConta: ListaModel[] = [];
  listContasFiltered: ListaModel[] = [];
  listOrigens: ListaModel[] = [];
  listParcelas: any[] = [];
  listOfOption: string[] = [];

  selectedValue = null;
  selectedCategory: string | null = null;
  selectedClient = null;
  selectedAccount = null;

  newMovForm: FormGroup;

  constructor(
    private themeService: ThemeService,
    private _fb: FormBuilder,
    private notification: NotificationService,
    private router: Router,
    private listaService: ListaService,
    private clienteService: ClienteService,
    private movimentacoesService: MovimentacoesService,
    private formateDateService: DataFormatterService,
    private location: Location
    
  ) {
    this.newMovForm = this._fb.group({
      Id: [0],
      Cliente: [null, [Validators.required, Validators.minLength(4)]],
      Categoria: ['', [Validators.required]],
      Conta: ['', [Validators.required]],
      Origem: [1, [Validators.required]],
      Descricao: [''],
      Valor: ['', [Validators.required]],
      ValorEntrada: [''],
      MovType: [0, [Validators.required]],
      Parcelas: [1, [Validators.required]],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });
    this.loadData();
  }

  loadData() {    

    this.loadLista('financeiro_origem', '');
    this.loadLista('financeiro_categoria', '');
    this.loadLista('financeiro_conta', '');
    this.loadCliente();
  }

  ngOnChangeUrl(){
    
    
    const tipoMovText = this.movType === '1' ? 'receitas' : this.movType === '2' ? 'despesas' : '';

    if (tipoMovText) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('tipoMov', tipoMovText);
  
      this.location.replaceState(currentUrl.pathname + currentUrl.search);
    }

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isUpdate'] && changes['isUpdate'].currentValue !== undefined) {
      if (this.isUpdate === true) {        
        this.selectedClient = this.dataUpdate.cliente_id;
        this.selectedCategory = this.dataUpdate.categoria_id;
        this.selectedAccount = this.dataUpdate.conta_id;
        this.newMovForm.patchValue({Id: this.dataUpdate.Id, Valor: this.dataUpdate.ValorTotal,ValorPendente: this.dataUpdate.ValorPendente, Descricao: this.dataUpdate.Descricao});
        this.listParcelas = this.dataUpdate.Parcelas;
      }
    }

    if (changes['catType'] && changes['catType'].currentValue !== undefined) {
      if (this.catType === 1) {
        this.cat = ' Simples';
      } else if (this.catType === 2) {
        this.cat = ' Completa';
        this.isSnParc = true;
      }
    }
  }

  saveMov() {
    const cliente = this.newMovForm.get('Cliente')?.value;
    const categoria = this.newMovForm.get('Categoria')?.value;
    const conta = this.newMovForm.get('Conta')?.value;
    const origem = 1;
    const descricao = this.newMovForm.get('Descricao')?.value;
    const valor = this.newMovForm.get('Valor')?.value;
    const tipoMov = this.newMovForm.get('MovType')?.value;
    const idMov = this.newMovForm.get('Id')?.value;    


    let mov = {};
    if (cliente && categoria && valor) {

      if (!this.isUpdate) {
        if (tipoMov > 0) {
          mov = {
            id_pessoa_cliente: cliente,
            categoria_id: categoria,
            origem_id: origem,
            descricao: descricao,
            tipo: tipoMov,
            conta: conta,
            parcelas:
              this.listParcelas && this.listParcelas.length > 0
                ? this.listParcelas.map((parcela) => ({
                    dt_venc: moment(parcela.DataVencimento).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    valor: parcela.Valor,
                    status: status,
                  }))
                : [
                    {
                      dt_venc: moment().format('YYYY-MM-DD HH:mm:ss'),
                      valor: parseFloat(valor) || 0                    
                    },
                  ],
          };
          
        } else { 
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            'Informe o tipo de movimentação financeira!'
          );
          return;
        }

        this.movimentacoesService.postNewMov(mov).subscribe({
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
            this.newMovForm.reset();
            this.isVisible = false;
            this.closeEvent.emit(false);
          },
        });
      } else {
        if (tipoMov > 0) {
          mov = {
            idMov: idMov,
            id_pessoa_cliente: cliente,
            categoria_id: categoria,
            descricao: descricao,
            tipo: tipoMov,
            conta: conta
          };
        } else {
          
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            'Informe o tipo de movimentação financeira!'
          );
          return;
        }

      this.movimentacoesService.putNewMov(mov).subscribe({
        next: (response) => {
          this.notification.createBasicNotification(
            'success',
            'bg-success',
            'text-light',
            response.message
          );
          this.clear();
          this.saveSuccess.emit(true);
        },
        error: (error) => {
          this.notification.createBasicNotification(
            'error',
            'bg-danger',
            'text-light',
            error.error
          );
          this.clear();
          this.saveSuccess.emit(false);
        },
        complete: () => {
          this.isVisible = false;
          this.closeEvent.emit(false);
        },
      });


      }

    } else {
      this.newMovForm.markAllAsTouched();
      this.saveSuccess.emit(false);
    }
  }

  loadLista(tabela: string, tipo: string) {
    this.listaService.getLista(tabela, tipo)?.subscribe({
      next: (v) => {
        if (tabela === 'financeiro_origem') {
          this.listOrigens = v;
        } else if (tabela === 'financeiro_conta') {
          this.listConta = v;
        } else if (tabela === 'financeiro_categoria') {
          this.listCategorias = v;
        }
      },
      error: (e) => this.processarErro(e),
    });
  }

  loadCliente() {
    this.clienteService.getCliente()?.subscribe({
      next: (v) => {
        this.listClientes = v;
      },
      error: (e) => this.processarErro(e),
    });
  }

  addCategory(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 4) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Nome da categoria deve ter pelo menos 4 caractéres.'
      );
      return;
    }
    const currentUrl = this.router.url;
    const tipoMov = currentUrl.endsWith('receitas')
      ? '1'
      : currentUrl.endsWith('despesas')
      ? '2'
      : '';

    if (!tipoMov) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Selecione Receita ou Despesa antes de cadastrar uma categoria!'
      );
      return;
    }

    const category = {
      name: _nome,
      tipo: tipoMov,
      tabela: 'financeiro_categoria',
    };

    this.listaService.postLista(category).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );

        this.loadLista('financeiro_categoria', tipoMov)
        input.value = '';
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

  addAccount(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 3) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Nome da conta deve ter pelo menos 3 caractéres.'
      );
      return;
    }
    const currentUrl = this.router.url;
    const tipoMov = currentUrl.endsWith('receitas')
      ? '1'
      : currentUrl.endsWith('despesas')
      ? '2'
      : '';

      
    if (!tipoMov) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Selecione Receita ou Despesa antes de cadastrar uma conta!'
      );
      return;
    }

    const account = {
      name: _nome,
      tipo: '',
      tabela: 'financeiro_conta',
    };

    this.listaService.postLista(account).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );

        this.loadLista('financeiro_conta', tipoMov);
        input.value = '';
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

  onParcelasChange(): void {
    setTimeout(() => {
      if (!this.isUpdate) {
        const valorTotal = this.newMovForm.get('Valor')?.value;
        const valorEntrada = this.newMovForm.get('ValorEntrada')?.value || 0;
        const qtdParcelas = this.newMovForm.get('Parcelas')?.value || 1;
        const valorFinal = valorTotal - valorEntrada;
  
        if (!valorTotal || valorTotal === 0) {
          this.newMovForm.get('Valor')?.markAsTouched();
          return;
        }
  
        let parcelas = [];        
        if (valorEntrada > 0 && Number(qtdParcelas) === 1) {
          // Cria a primeira parcela com a entrada e vencimento atual          
          parcelas.push({
            Id: 1,
            Nr: 1,
            DataVencimento: moment().format('YYYY-MM-DD HH:mm:ss'),
            Valor: parseFloat(valorEntrada.toFixed(2)),
          });
  
          // Cria a segunda parcela com o saldo restante e vencimento em 30 dias
          if (valorFinal > 0) {
            parcelas.push({
              Id: 2,
              Nr: 2,
              DataVencimento: moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
              Valor: parseFloat(valorFinal.toFixed(2)),
            });
          }
        } else {
          // Caso normal (mais de uma parcela)
          const qtdRestante = valorEntrada > 0 ? qtdParcelas - 1 : qtdParcelas;
          const valorParcela = qtdRestante > 0 ? valorFinal / qtdRestante : 0;
  
          // Se houver entrada, cria a primeira parcela com a entrada
          if (valorEntrada > 0) {
            parcelas.push({
              Id: 1,
              Nr: 1,
              DataVencimento: moment().format('YYYY-MM-DD HH:mm:ss'),
              Valor: parseFloat(valorEntrada.toFixed(2)),
            });
          }
  
          // Cria as parcelas restantes
          for (let i = 0; i < qtdRestante; i++) {
            parcelas.push({
              Id: parcelas.length + 1,
              Nr: parcelas.length + 1,
              DataVencimento: moment().add((i + 1) * 30, 'days').format('YYYY-MM-DD HH:mm:ss'),
              Valor: parseFloat(valorParcela.toFixed(2)),
            });
          }
        }
  
        this.listParcelas = parcelas;
      }
    }, 0);
  }

  isInvalid(controlName: string): boolean {
    const control = this.newMovForm.get(controlName);
    return (
      (control?.invalid ?? false) &&
      ((control?.dirty ?? false) || (control?.touched ?? false))
    );
  }

  typechange(event: any): void {
    this.movType = event;
  }

  handleOk(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  handleCancel(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  clear(){
    const currentUrl = new URL(window.location.href);
    this.isSnParc = false;
    this.isVisible = false;
    this.newMovForm.reset();
    this.selectedAccount = null;
    this.selectedClient = null;
    this.selectedCategory = null;
    this.listParcelas = [];
    this.location.replaceState(currentUrl.pathname);
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

  formatData(date:any): string{
    return this.formateDateService.formatarData(date);
  }
}

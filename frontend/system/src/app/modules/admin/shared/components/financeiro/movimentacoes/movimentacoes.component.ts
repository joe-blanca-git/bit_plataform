import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ThemeService } from '../../../services/themeService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ClienteModel } from '../../../models/cliente.model';
import { ListaModel } from '../../../models/lista.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { ListaService } from '../../../services/lista.service';
import { ClienteService } from '../../../services/cliente.service';
import * as moment from 'moment';


@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss'],
})
export class MovimentacoesComponent implements OnChanges {
  @Input('statusModal') isVisible: boolean = false;
  @Input('typeMov') movType: number = 0;
  @Input('catMov') catType: number = 0;
  @Output() closeEvent = new EventEmitter<boolean>();

  theme: 'dark' | 'light' = 'dark';

  cat = '';
  statusMov = 'P';

  isConfirmLoading = false;
  clienteNotFound = false;
  isUpdate = false;

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



  ) {
    this.newMovForm = this._fb.group({
      Cliente: [null, [Validators.required, Validators.minLength(4)]],
      Categoria: ['', [Validators.required]],
      Conta: ['', [Validators.required]],
      Origem: [1, [Validators.required]],
      Descricao: [''],
      Valor: ['', [Validators.required]],
      Status:['P', [Validators.required]],
      Parcelas: [1],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    }); 

    this.loadData();
  
  }

  loadData() {
   
    const currentUrl = this.router.url;
    const tipoMov = currentUrl.endsWith('receitas')
      ? '1'
      : currentUrl.endsWith('despesas')
      ? '2'
      : '';

    this.loadLista('financeiro_origem', '');
    this.loadLista('financeiro_categoria', '');
    this.loadLista('financeiro_conta', '');
    this.loadCliente();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catType'] && changes['catType'].currentValue !== undefined) {
      if (this.catType === 1) {
        this.cat = ' Simples';
      } else if (this.catType === 2) {
        this.cat = ' Completa';
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
    const currentUrl = this.router.url;
    const status = this.newMovForm.get('Status')?.value;
    let tipoMov = currentUrl.endsWith('receitas')
      ? '1'
      : currentUrl.endsWith('despesas')
      ? '2'
      : '';
  

    if (cliente && categoria && valor) {   
      
      const mov = {
        id_pessoa_cliente: cliente,
        categoria_id: categoria,
        origem_id: origem,
        descricao: descricao,
        tipo: tipoMov,
        conta: conta,
        parcelas:
          this.listParcelas && this.listParcelas.length > 0
            ? this.listParcelas.map((parcela) => ({
              dt_venc: moment(parcela.DataVenc, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"),
                valor: parcela.Valor,
                status: status
              }))
            : [
                {
                  dt_venc: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '),
                  valor: parseFloat(valor) || 0,
                  status: status
                },
              ],
      };

      console.log(JSON.stringify(mov));
      
            
      // this.movService.postNewMov(mov).subscribe({
      //   next: (response) => {
      //     this.notification.createBasicNotification(
      //       'success',
      //       'bg-success',
      //       'text-light',
      //       response.message
      //     );
      //     this.saveSuccess.emit(true);
      //   },
      //   error: (error) => {
      //     this.notification.createBasicNotification(
      //       'error',
      //       'bg-danger',
      //       'text-light',
      //       error.error
      //     );
      //     this.saveSuccess.emit(true);
      //   },
      //   complete: () => {
      //     this.newMovForm.reset();
      //     this.saveSuccess.emit(true);
      //     this.isVisible = false;
      //   },
      // });
    } else {
      this.newMovForm.markAllAsTouched();
    //  this.saveSuccess.emit(false);
    }
  }
  
  loadLista(tabela: string, tipo: string){
    this.listaService.getLista(tabela, tipo)?.subscribe({
      next: (v) => {
        if(tabela === 'financeiro_origem'){          
          this.listOrigens = v;
        }else if (tabela === 'financeiro_conta'){          
          this.listConta = v;
        }else if (tabela === 'financeiro_categoria'){          
          this.listCategorias = v;
        }
      },
      error: (e) => this.processarErro(e),
      complete: () => console.log('loadComplete')
    })
  }

  loadCliente(){
    this.clienteService.getCliente()?.subscribe({
      next: (v) => {
        this.listClientes = v;
      },
      error: (e) => this.processarErro(e),
      complete: () => console.log('loadComplete')
    })
  }

  addCategory(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 4) {
      this.notification.createBasicNotification('error', 'bg-danger', 'text-light', 'Nome da categoria deve ter pelo menos 4 caractéres.')
      return;
      
    };
    const currentUrl = this.router.url;
    const tipoMov = currentUrl.endsWith('receitas')
    ? '1'
    : currentUrl.endsWith('despesas')
    ? '2'
    : '';

    const category = {
      name: _nome,
      tipo: tipoMov,
      tabela: "financeiro_categoria"
    };

    this.listaService.postLista(category).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );

        // this.loadLista('financeiro_categoria', tipoMov).then((lista) => {
        //   this.listCategorias = lista;
        // });

        input.value = '';

      },
      error:(e) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          e.error
        );
      },
      complete:() => {


        
      },
    })


  }

  addAccount(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 3) {
      this.notification.createBasicNotification('error', 'bg-danger', 'text-light', 'Nome da conta deve ter pelo menos 3 caractéres.')
      return;
      
    };
    const currentUrl = this.router.url;
    const tipoMov = currentUrl.endsWith('receitas')
    ? '1'
    : currentUrl.endsWith('despesas')
    ? '2'
    : '';

    const account = {
      name: _nome,
      tipo: '',
      tabela: "financeiro_conta"
    };

    this.listaService.postLista(account).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );

        // this.loadLista('financeiro_conta', '').then((lista) => {
        //   this.listConta = lista;
        // });

        input.value = '';

      },
      error:(e) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          e.error
        );
      },
      complete:() => {


        
      },
    })


  }

  addPeople(input: HTMLInputElement): void {
    const _nome = input.value;

    if (_nome.length < 4) {
      this.notification.createBasicNotification('error', 'bg-danger', 'text-light', 'Nome da pessoa deve ter pelo menos 4 caractéres.')
      return;
      
    };

    const people = {
      nome: _nome
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
      error:(e) => {
        this.notification.createBasicNotification('error','bg-danger','text-light',e.error);
      },
      complete:() => {
      },
    })
  }

  onParcelasChange(): void {
    if (!this.isUpdate) {
      const valorTotal = this.newMovForm.get('Valor')?.value;
      const qtdParcelas = this.newMovForm.get('Parcelas')?.value || 1;
  
      if (
        valorTotal === null ||
        valorTotal === undefined ||
        valorTotal === 0 ||
        valorTotal === ''
      ) {
        this.newMovForm.get('Valor')?.markAsTouched();
        return;
      }
  
      const valorParcela = valorTotal / qtdParcelas;
      this.listParcelas = Array.from({ length: qtdParcelas }, (_, index) => {
        const vencimento = moment()
          .add((index + 1) * 30, 'days')
          .format('DD/MM/YYYY');
        return {
          Id: index + 1,
          Nr: index + 1,
          DataVenc: vencimento,
          Valor: parseFloat(valorParcela.toFixed(2)),
        };
      });
    }
  }

  changeTheme() {
    this.themeService.changeTheme();
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.newMovForm.get(controlName);
    return (
      (control?.invalid ?? false) &&
      ((control?.dirty ?? false) || (control?.touched ?? false))
    );
  }

  handleOk(): void {
    this.isVisible = false;
    this.closeEvent.emit(false);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.closeEvent.emit(false);
  }

  processarErro(erro: any) {
    if (erro.error) {
      if (erro.error.errors.Mensagens) {
        for (let e of erro.error.errors.Mensagens) {
          this.notification.createBasicNotification('error', 'bg-danger', 'text-light', e);
        }
      }
    } else {
      this.notification.createBasicNotification('error', 'bg-danger', 'text-light', erro);
    }
  }


}

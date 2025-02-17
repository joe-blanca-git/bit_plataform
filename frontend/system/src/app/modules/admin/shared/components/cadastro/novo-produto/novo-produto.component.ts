import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataFormatterService } from 'src/app/shared/services/data-formatter-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValorFormatterService } from 'src/app/shared/services/valor-formatter-service.service';
import { ThemeService } from '../../../services/themeService';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ProdutoService } from '../../../services/produto.service';
import { FornecedorModel } from '../../../models/fornecedor.model';
import { ListaService } from '../../../services/lista.service';
import { ProdutoCategoriaModel } from '../../../models/produto.model';

@Component({
  selector: 'app-novo-produto',
  templateUrl: './novo-produto.component.html',
  styleUrls: ['./novo-produto.component.scss'],
})
export class NovoProdutoComponent {
  @Input('statusModal') isVisible: boolean = false;
  @Input('dadoProduto') dadoProduto!: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<boolean>();

  theme: 'dark' | 'light' = 'dark';

  novoProdutoForm: FormGroup;

  selectedFornecedor = null;
  selectedCategoriaProduto = null;
  selectedUnMedida = null;

  invalidFornecedor = false;

  listCategoriaProduto: ProdutoCategoriaModel []= [];
  listFornecedor: FornecedorModel[] = [];
  listSelectedFornecedor: any[] = [];
  listUnidadeMedida: any[] = [
    { id: 1, nome: 'cm' },
    { id: 2, nome: 'g' },
    { id: 3, nome: 'galão' },
    { id: 4, nome: 'gros' },
    { id: 5, nome: 'kg' },
    { id: 6, nome: 'l' },
    { id: 7, nome: 'm' },
    { id: 8, nome: 'm²' },
    { id: 9, nome: 'm³' },
    { id: 10, nome: 'mm' },
    { id: 11, nome: 'mol' },
    { id: 12, nome: 'par' },
    { id: 13, nome: 'pct' },
    { id: 14, nome: 'peça' },
    { id: 15, nome: 'saco' },
    { id: 16, nome: 'ton' },
    { id: 17, nome: 'un' },
    { id: 18, nome: 'vd' }
  ];
  

  constructor(
    private themeService: ThemeService,
    private _fb: FormBuilder,
    private notification: NotificationService,
    private formateDateService: DataFormatterService,
    private formateValueService: ValorFormatterService,
    private fornecedoService: FornecedorService,
    private produtoService: ProdutoService,
    private listaService: ListaService
  ) {
    this.novoProdutoForm = this._fb.group({
      EAN: [null, Validators.required],
      Nome: [null],
      Custo: [null, Validators.required],
      Venda: [null, Validators.required],
      QtdePCaixa: [null, Validators.required],
      UnMedida: [null, Validators.required],
      Categoria: [null, Validators.required],
      EstoqueMin: [null, Validators.required],
      EstoqueMax: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
    });

    this.loadFornecedor();
    this.loadCategoria();
  }

  addProduto() {
    const bodyJson = this.novoProdutoForm.value;
    bodyJson.Fornecedores = this.listSelectedFornecedor.map(fornecedor => ({ id: fornecedor.id }));
    
    if(this.listSelectedFornecedor.length === 0){
      this.notification.createBasicNotification('error','bg-danger', 'text-light', 'Selecione ao menos um fornecedor por Produto!')
    };

    if (this.novoProdutoForm.valid) {
      this.produtoService.postProduto(bodyJson).subscribe({
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
          this.clear();
          this.closeEvent.emit(false);
        },
      })
    } else {
      this.novoProdutoForm.markAllAsTouched();
      this.notification.createBasicNotification('error','bg-danger', 'text-light', 'Preencha todas as informações obrigatórias!')
    };
    
  }

  loadCategoria(){
    this.produtoService.getCategoriaProduto()?.subscribe({
      next: (v) => {
        this.listCategoriaProduto = v;        
      },
      error: (e) => this.processarErro(e)
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

  addFornecedor(): void {
    this.invalidFornecedor = false;
    if (this.selectedFornecedor) {
      const fornecedorSelecionado = this.listFornecedor.find(
        (item) => item.id === this.selectedFornecedor
      );
  
      if (fornecedorSelecionado) {
        const jaExiste = this.listSelectedFornecedor.some(
          (item) => item.id === fornecedorSelecionado.id
        );
  
        if (!jaExiste) {
          this.listSelectedFornecedor.push({
            id: fornecedorSelecionado.id,
            nome: fornecedorSelecionado.nome
          });
        }
      }
  
      this.selectedFornecedor = null;
    }else {
      this.invalidFornecedor = true;
    }
  }

  deleteFornecedor(id: number): void {
    this.listSelectedFornecedor = this.listSelectedFornecedor.filter(
      (item) => item.id !== id
    );
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

    const category = {
      name: _nome,
      tipo: '',
      tabela: 'produto_categoria',
    };

    this.listaService.postLista(category).subscribe({
      next: (r) => {
        this.notification.createBasicNotification(
          'success',
          'bg-success',
          'text-light',
          r.message
        );

        this.loadCategoria()
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

  handleOk(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  handleCancel(): void {
    this.clear();
    this.closeEvent.emit(false);
  }

  clear() {
    this.novoProdutoForm.reset();
    this.listSelectedFornecedor = [];
  }

  isInvalid(controlName: string): boolean {
    const control = this.novoProdutoForm.get(controlName);
    return (
      (control?.invalid ?? false) &&
      ((control?.dirty ?? false) || (control?.touched ?? false))
    );
    return false;
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
}

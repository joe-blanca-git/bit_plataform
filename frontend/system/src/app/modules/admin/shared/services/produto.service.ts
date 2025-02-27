import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { ProdutoCategoriaModel, ProdutoModel } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router);
  }



  getProduto(produto: any, fornecedor: any): Observable<ProdutoModel[]> | null {
    const userData = localStorage.getItem('BIT.user');

    if (!userData) {
      console.error('Dados do usuário não encontrados');
      return null;
    }

    try {
      const parsedData = JSON.parse(userData);
      const { id, empresa } = parsedData;

      if (!id || !empresa) {
        console.error('Usuário ou empresa não definidos no objeto armazenado.');
        return null;
      }

      let url = this.urlGetProduto
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa));

      if (produto !== null) {
        url = url.replace('{{idProduto}}', encodeURIComponent(Number(produto)));
      }

      if (fornecedor !== null) {
        url = url.replace(
          '{{idFornecedor}}',
          encodeURIComponent(Number(fornecedor))
        );
      }

      return this.httpClient
        .get<ProdutoModel[]>(url, super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
    } catch (error) {
      console.error('Erro ao analisar o JSON do localStorage:', error);
      return null;
    }
  }

  getCategoriaProduto() {
    const userData = localStorage.getItem('BIT.user');

    if (!userData) {
      console.error('Dados do usuário não encontrados');
      return null;
    }

    try {
      const parsedData = JSON.parse(userData);
      const { id, empresa } = parsedData;

      if (!id || !empresa) {
        console.error('Usuário ou empresa não definidos no objeto armazenado.');
        return null;
      }

      let url = this.urlGetCategoriaProduto
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa));

      return this.httpClient
        .get<ProdutoCategoriaModel[]>(url, super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
    } catch (error) {
      console.error('Erro ao analisar o JSON do localStorage:', error);
      return null;
    }
  }

  postProduto(body: any) {
    const userData = localStorage.getItem('BIT.user');

    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }

    const parsedData = JSON.parse(userData);
    const { id, empresa } = parsedData;

    if (!id || !empresa) {
      throw new Error('Usuário ou empresa não definidos no objeto armazenado.');
    }

    const updatedBody = {
      ...body,
      id_user_inc: id,
      id_empresa: empresa,
    };

    const url = this.urlPostProduto;

    return this.httpClient
      .post(url, updatedBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  putProduto(body:any){
    const userData = localStorage.getItem('BIT.user');
  
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }
  
    const parsedData = JSON.parse(userData);
    const { id, empresa } = parsedData;
  
    if (!id || !empresa) {
      throw new Error('Usuário ou empresa não definidos no objeto armazenado.');
    }
  
    const updatedBody = {
      ...body,
      id_user_inc: id,
      id_empresa: empresa
    };
  
    const url = this.urlPutProduto;
 
    return this.httpClient
      .put(url, updatedBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  deleteProduto(idProduto: number){
    const userData = localStorage.getItem('BIT.user');
  
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }
  
    const parsedData = JSON.parse(userData);
    const { id, empresa } = parsedData;
  
    if (!id || !empresa) {
      throw new Error('Usuário ou empresa não definidos no objeto armazenado.');
    }
    
    const url = this.urlDeleteProduto
    .replace('{{idUser}}', encodeURIComponent(id))
    .replace('{{idEmpresa}}', encodeURIComponent(empresa))
    .replace('{{idProduto}}', encodeURIComponent(idProduto))
    ;
 
    return this.httpClient
      .delete(url, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }




}

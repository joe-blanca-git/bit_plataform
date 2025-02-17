import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { FornecedorModel } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router); 
  }

  getFornecedor(): Observable<FornecedorModel[]> | null {  
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
  
      const url = this.urlGetCFornecedor
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa));
      
        return this.httpClient
          .get<FornecedorModel[]>(url, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
    } catch (error) {
      console.error('Erro ao analisar o JSON do localStorage:', error);
      return null;
    }
  }

  postFornecedor(body: any){
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
    } 

    const url = this.urlPostFornecedor;

    return this.httpClient
    .post(url, updatedBody, this.ObterAuthHeaderJson())
    .pipe(
      map((data) => this.extractData(data)),
      catchError(this.serviceError)
    );
  }
}

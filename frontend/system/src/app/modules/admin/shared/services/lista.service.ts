import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ListaModel } from '../models/lista.model';

@Injectable({
  providedIn: 'root',
})
export class ListaService extends BaseService {
   constructor(public httpClient: HttpClient, router: Router) {
     super(router); 
   }

  getLista(tabela: string, tipo:string): Observable<ListaModel[]> | null {  
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
  
      const url = this.urlGetLista
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa))
        .replace('{{tabela}}', encodeURIComponent(tabela))
        .replace('{{tipo}}', encodeURIComponent(tipo));

        return this.httpClient
          .get<ListaModel[]>(url, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
    } catch (error) {
      console.error('Erro ao analisar o JSON do localStorage:', error);
      return null;
    }
  }

  postLista(body: any){
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

    const url = this.urlPostLista;          

    return this.httpClient
    .post(url, updatedBody, this.ObterAuthHeaderJson())
    .pipe(
      map((data) => this.extractData(data)),
      catchError(this.serviceError)
    );
  }
  
}


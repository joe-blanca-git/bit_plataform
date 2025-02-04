import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClienteModel } from '../models/cliente.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClienteService extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router); 
  }

  getCliente(): Observable<ClienteModel[]> | null {  
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
  
      const url = this.urlGetCliente
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa));
      
        return this.httpClient
          .get<ClienteModel[]>(url, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
    } catch (error) {
      console.error('Erro ao analisar o JSON do localStorage:', error);
      return null;
    }
  }

  postCliente(body: any){
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

    const url = this.urlPosCliente;

    return this.httpClient
    .post(url, updatedBody, this.ObterAuthHeaderJson())
    .pipe(
      map((data) => this.extractData(data)),
      catchError(this.serviceError)
    );
  }

}

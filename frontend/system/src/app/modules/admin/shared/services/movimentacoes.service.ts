import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { MovModel } from '../models/mov.model';


@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router); 
  }

  postNewMov(body: any) {
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
  
    const url = this.urlPostNewMov;
 
    return this.httpClient
      .post(url, updatedBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  putNewMov(body: any) {
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
  
    const url = this.urlPutMov;
 
    return this.httpClient
      .put(url, updatedBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  deleteNewMov(idMov: number) {
    const userData = localStorage.getItem('BIT.user');
  
    if (!userData) {
      throw new Error('Dados do usuário não encontrados');
    }
  
    const parsedData = JSON.parse(userData);
    const { id, empresa } = parsedData;
  
    if (!id || !empresa) {
      throw new Error('Usuário ou empresa não definidos no objeto armazenado.');
    }
    
    const url = this.urlDeleteMov
    .replace('{{idUser}}', encodeURIComponent(id))
    .replace('{{idEmpresa}}', encodeURIComponent(empresa))
    .replace('{{idMov}}', encodeURIComponent(idMov))
    ;
 
    return this.httpClient
      .delete(url, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }

  getMov(){
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
  
      const url = this.urlGetMov
        .replace('{{idUser}}', encodeURIComponent(id))
        .replace('{{idEmpresa}}', encodeURIComponent(empresa));

        return this.httpClient.get<MovModel[]>(url, this.ObterAuthHeaderJson()).pipe(
          map((response) => {
            if (!response || Object.keys(response).length === 0) {
              console.warn('A resposta está vazia.');
              return [];
            }
            return response;
          }),
          catchError((err) => {
            return throwError(err);
          })
        );

      } catch (error) {
        return null;
      }
  }

}

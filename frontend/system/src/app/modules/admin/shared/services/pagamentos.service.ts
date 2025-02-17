import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService  extends BaseService {

  constructor(public httpClient: HttpClient, router: Router) {
    super(router); 
  }

  postNewMovPag(body: any) {
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
  
    const url = this.urlPostNewMovPag;
 
    return this.httpClient
      .post(url, updatedBody, this.ObterAuthHeaderJson())
      .pipe(
        map((data) => this.extractData(data)),
        catchError(this.serviceError)
      );
  }
}

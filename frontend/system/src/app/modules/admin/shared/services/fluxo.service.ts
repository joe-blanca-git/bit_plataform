import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, throwError } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { MovModel } from '../models/mov.model';

@Injectable({
  providedIn: 'root'
})
export class FluxoService  extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router); 
  }

  getFluxo(){
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
  
      const url = this.urlGetFluxo
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

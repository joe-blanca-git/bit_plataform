import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClienteModel } from '../models/cliente.model';
import { Router } from '@angular/router';
import { NoticiasResponseModel } from '../models/noticia.model';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService extends BaseService {
  constructor(public httpClient: HttpClient, router: Router) {
    super(router);
  }

  getNoticia(): Observable<NoticiasResponseModel> | null {
    const hoje = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(hoje.getDate() - 30);
  
    const formatoData = (data: Date) =>
      `${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}-${data.getFullYear()}`;
  
    const url = `https://servicodados.ibge.gov.br/api/v3/noticias/?busca=economia&introsize=700&de=${formatoData(dataInicio)}&ate=${formatoData(hoje)}`;
  
    return this.httpClient
      .get<NoticiasResponseModel>(url, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }
  
}

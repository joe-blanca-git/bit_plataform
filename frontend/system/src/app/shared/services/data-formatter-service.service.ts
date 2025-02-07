import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  formatarData(data: string): string {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  formatarData(data: string, abrev: boolean): string {
    const [dia, mes, ano] = data.split('/');
    const dataFormatada = new Date(`${mes}/${dia}/${ano}`);
    
    const diaFormatado = String(dataFormatada.getDate()).padStart(2, '0');
    const mesAbreviado = dataFormatada.toLocaleString('default', { month: 'short' });
    const anoFormatado = dataFormatada.getFullYear(); 

    if (abrev) {
      return `${diaFormatado}-${mesAbreviado}`;
    }

    return `${diaFormatado}/${String(dataFormatada.getMonth() + 1).padStart(2, '0')}/${anoFormatado}`;
  }
}

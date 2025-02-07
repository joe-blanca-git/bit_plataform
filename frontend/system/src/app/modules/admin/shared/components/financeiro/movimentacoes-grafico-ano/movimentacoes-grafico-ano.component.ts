import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-movimentacoes-grafico-ano',
  templateUrl: './movimentacoes-grafico-ano.component.html',
  styleUrls: ['./movimentacoes-grafico-ano.component.scss'],
})
export class MovimentacoesGraficoAnoComponent {
  @ViewChild('grFinanceiroAno', { static: true }) element!: ElementRef;
  @Input('data') data: any;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadData();    
  }

  loadData() {
    const months = moment.monthsShort();
    const receitasData: Record<string, number> = months.reduce(
      (acc, month) => ({ ...acc, [month]: 0 }),
      {}
    );
    const despesasData: Record<string, number> = months.reduce(
      (acc, month) => ({ ...acc, [month]: 0 }),
      {}
    );

    this.data.forEach((item: any) => {
      const month = moment(item.DataInclusao).format('MMM');
      
      if (item.Tipo === '1' && receitasData[month] !== undefined) {
        receitasData[month] += item.ValorTotal;
      } else if (item.Tipo === '2' && despesasData[month] !== undefined) {
        despesasData[month] += item.ValorTotal;
      }
    });

    new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            data: months.map((m) => receitasData[m]),
            label: 'Receitas',
            fill: true,
            borderColor: 'rgba(25, 135, 84, 0.1450980392)',
            backgroundColor: 'rgba(25, 135, 84, 0.1450980392)',
            //pointRadius: 0,
          },
          {
            data: months.map((m) => despesasData[m]),
            label: 'Despesas',
            fill: true,
            borderColor: 'rgba(255, 0, 0, 0.2)',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            //pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { display: false }
          },
        },
      },
    });
  }
}

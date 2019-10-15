import { Component, OnInit } from '@angular/core';
/* import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { CommonModule } from '@angular/common'; */


@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {
   public items=[];

  graficos: any = {
    'grafico1': {
      'labels': ['Con Frijoles', 'Con Natilla', 'Con tocino'],
      'data':  [24, 30, 46],
      'type': 'doughnut',
      'leyenda': 'El pan se come con'
    },
    'grafico2': {
      'labels': ['Hombres', 'Mujeres'],
      'data':  [4500, 6000],
      'type': 'doughnut',
      'leyenda': 'Entrevistados'
    },
    'grafico3': {
      'labels': ['Si', 'No'],
      'data':  [95, 5],
      'type': 'doughnut',
      'leyenda': '¿Le dan gases los frijoles?'
    },
    'grafico4': {
      'labels': ['No', 'Si'],
      'data':  [85, 15],
      'type': 'doughnut',
      'leyenda': '¿Le importa que le den gases?'
    },
  };

  constructor() {
    // tslint:disable-next-line: forin
    for(var prop in this.graficos) {
      this.items.push(this.graficos[prop]);
    }
    /* console.log(this.items); */
   }

  ngOnInit() {
  }

}

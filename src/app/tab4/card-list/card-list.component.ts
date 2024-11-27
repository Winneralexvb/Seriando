import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DetailspageComponent } from 'src/app/components/detailspage/detailspage.component';


@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  
})
export class CardListComponent  implements  OnChanges {
  @Input() text!: string;
  @Input() movies: any[] = [];
  
  
  ngOnChanges(changes: SimpleChanges) {
    // Detecta alterações e pode fazer alguma lógica de limpeza se necessário
    if (changes['movies']) {
     
      // Qualquer lógica de processamento dos dados pode ser colocada aqui
    }
  }

}

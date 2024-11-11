import { Component } from '@angular/core';
import { StateService } from '../services/segment/state.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  selectedSegment: string = 'filmes'; // Define um valor padrão
  constructor(private stateService: StateService) { }

  ngOnInit() {
    // Inicializa o selectedSegment a partir do StateService
    this.selectedSegment = this.stateService.getSelectedSegment() || 'filmes'; // ou qualquer valor padrão
  }

  onSegmentChange(value: string) {
    this.selectedSegment = value;
    this.stateService.setSelectedSegment(value); // Salva o valor no service
  }


}

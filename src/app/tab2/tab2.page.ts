import { Component, OnInit, } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';
import { StateService } from '../services/segment/state.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  selectedSegment: string = 'filmes'; // Define um valor padrão




  constructor(private navCtrl: NavController, private stateService: StateService) {
    this.selectedSegment = this.stateService.getSelectedSegment();
  }

  ngOnInit() {
    // Observa o segmento selecionado para atualizar a variável local automaticamente
    this.stateService.selectedSegment$.subscribe(segment => {
      this.selectedSegment = segment;
    });
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  onSegmentChange(value: any) {
    this.stateService.setSelectedSegment(value); // Atualiza o valor global
  }

}

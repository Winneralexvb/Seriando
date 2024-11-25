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
  searchResults: any[] = [];
  upcomingMovies: any[] = [];



  constructor(private navCtrl: NavController, private stateService: StateService, private tmdbService: TmdbService) {
    this.selectedSegment = this.stateService.getSelectedSegment();
  }

  ngOnInit() {
    // Observa o segmento selecionado para atualizar a variável local automaticamente
    this.stateService.selectedSegment$.subscribe(segment => {
      this.selectedSegment = segment;
      this.fetchUpcomingMovies();
    });
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  onSegmentChange(value: any) {
    this.stateService.setSelectedSegment(value); // Atualiza o valor global
  }

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
  }

  fetchUpcomingMovies() {
    this.tmdbService.getMovies().subscribe((response: any) => {
      const today = new Date().toISOString();
      this.upcomingMovies = response.results.filter((movie: any) => movie.release_date > today);
    });
  }

}

import { Component, OnInit, } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';
import { StateService } from '../services/segment/state.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  populares: any[] = [];
  trending: any[] = [];
  randomGenres: any[] = [];
  genres: any[] = [];
  selectedSegment: string = ''; // Define um valor padrão

  constructor(
    private navCtrl: NavController,
    private tmdbService: TmdbService,
    private stateService: StateService
  ) {
    this.selectedSegment = this.stateService.getSelectedSegment(); // Obtem o valor do segmento

  }

  ngOnInit() {
    // Observa o segmento selecionado para atualizar a variável local automaticamente
    this.stateService.selectedSegment$.subscribe(segment => {
      this.selectedSegment = segment;
    });
    this.loadMovies();
    this.loadGenres();
  }

  onSegmentChange(value: any) {
    this.stateService.setSelectedSegment(value); // Atualiza o valor global
  }


  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  loadMovies() {
    this.tmdbService.getPopularMovies().subscribe((data: any) => {
      this.populares = data.results;
    });

    this.tmdbService.getTrendingMovies().subscribe((data: any) => {
      this.trending = data.results;
    });
  }

  loadGenres() {
    this.tmdbService.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      this.getRandomGenres();
    });
  }

  getRandomGenres() {
    const shuffled = this.genres.sort(() => 0.5 - Math.random());
    const selectedGenres = shuffled.slice(0, 4); // Seleciona 4 gêneros aleatórios

    selectedGenres.forEach(genre => {
      this.tmdbService.getMoviesByGenre(genre.id).subscribe((data: any) => {
        this.randomGenres.push({ genre: genre.name, movies: data.results.slice(0, 4) });  // Garante que são 4 filmes
      });
    });
  }
}

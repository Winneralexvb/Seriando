import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';
import { StateService } from '../services/segment/state.service';
import { ModalController } from '@ionic/angular';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { DetailspageComponent } from '../components/detailspage/detailspage.component';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  /* Filmes */
  populares: any[] = [];
  trending: any[] = [];
  genres: any[] = [];
  /* Séries */
  seriesPopulares: any[] = [];
  seriesTrending: any[] = [];
  seriesGenres: any[] = [];
  randomSeriesGenres: any[] = [];

  /* + */
  randomGenres: any[] = [];
  popularTitle: string = "Populares";
  seriesTitle: string = "Séries Populares";
  selectedSegment: string = ''; // Define um valor padrão

  /* Pesquisa */
  showSearchbar = false;  // Inicialmente o searchbar está oculto
  isSearchbarVisible: boolean = true; // Controla a visibilidade do searchbar


  constructor(private navCtrl: NavController, private tmdbService: TmdbService, private stateService: StateService) {
    this.selectedSegment = this.stateService.getSelectedSegment(); // Obtem o valor do segmento
  }

  ngOnInit() {
    // Observa o segmento selecionado para atualizar a variável local automaticamente
    this.stateService.selectedSegment$.subscribe(segment => {
      this.selectedSegment = segment;
    });
    this.loadMovies();
    this.loadSeries();
    this.loadGenres();
    this.loadSeriesGenres();
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  onSegmentChange(value: any) {
    this.stateService.setSelectedSegment(value); // Atualiza o valor global
  }

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;  // Alterna a visibilidade
  }

  onSearchbarClose() {
    this.isSearchbarVisible = false; // Oculta o searchbar quando o evento 'close' for emitido
  }
  

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
  }
  


  /* Order */
  loadMovies() {
    // Carrega filmes populares
    this.tmdbService.getPopularMovies().subscribe((data: any) => {
      this.populares = data.results; // Atualiza a lista de filmes populares
    });

    // Carrega filmes em alta
    this.tmdbService.getTrendingMovies().subscribe((data: any) => {
      this.trending = data.results; // Carrega filmes em alta
    });
  }

  loadSeries() {
    // Carrega séries populares
    this.tmdbService.getPopularSeries().subscribe((data: any) => {
      this.seriesPopulares = data.results; // Atualiza a lista de séries populares
    });

    // Carrega séries em alta
    this.tmdbService.getPopularSeries().subscribe((data: any) => {
      this.seriesTrending = data.results; // Carrega séries em alta
    });
  }

  loadGenres() {
    this.tmdbService.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      this.getRandomGenres();
    });

    // Carrega gêneros de séries
    this.tmdbService.getTvGenres().subscribe((data: any) => {
      this.seriesGenres = data.genres; // Atualiza a lista de gêneros de séries
    });
  }

  loadSeriesGenres() {
    this.tmdbService.getTvGenres().subscribe((data: any) => {
      this.genres = data.genres;
      this.getRandomSeriesGenres();
    });
  }


  getRandomSeriesGenres() {
    const shuffled = this.genres.sort(() => 0.5 - Math.random()); // Embaralha os gêneros
    const selectedGenres = shuffled.slice(0, 4); // Seleciona 4 gêneros aleatórios

    selectedGenres.forEach(genre => {
      this.tmdbService.getTrendingSeriesByGenre(genre.id).subscribe((data: any) => {
        this.randomSeriesGenres.push({ genre: genre.name, series: data.results.slice(0, 4) }); // Obtém até 4 séries por gênero
      });
    });
  }

  getRandomGenres() {
    const shuffled = this.genres.sort(() => 0.5 - Math.random()); // Embaralha os gêneros
    const selectedGenres = shuffled.slice(0, 4); // Seleciona 4 gêneros aleatórios

    selectedGenres.forEach(genre => {
      this.tmdbService.getTrendingMoviesByGenre(genre.id).subscribe((data: any) => {
        this.randomGenres.push({ genre: genre.name, movies: data.results.slice(0, 4) });
      });
    });
  }
}

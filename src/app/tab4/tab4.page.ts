import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';
import { AuthService } from '../services/auth/auth.service';
import { DbService } from '../services/db/db.service';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {
  backdrops: any[] = [];
  favoritesMovies: any[] = [];
  favoritesTvs: any[] = [];
  tvList: any[] = [];
  movieList: any[] = [];
  userEmail: string | null = '';
  

  constructor(private navCtrl: NavController, private tmdbService: TmdbService, private authService: AuthService, private dbService: DbService,private cdr: ChangeDetectorRef) {}

  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
  }
  
  ngOnInit() {
    this.loadBackdropImages();
    this.getFavoritesMovies();
    this.getFavoritesTV();
    this.getList();
    this.getUser();
  }

  loadBackdropImages() {
    const seriesId = 94997; // Exemplo de ID de série (The Walking Dead)
    this.tmdbService.getBackdropImages('tv', seriesId).subscribe((data: any) => {
      this.backdrops = data.backdrops.filter((image: any) => image.iso_639_1 === null);
    });
  }

  logOut(){
    this.authService.logOut()
  }


  async getFavoritesMovies() {
    this.authService.User$.subscribe(async (user) => {
      if (user) {
        try {
          this.dbService.getFavoritesMovies(user.uid).subscribe((data) => {
            console.log(data);
  
            this.favoritesMovies = [];  // Limpa a lista de filmes
  
            // Loop pelos filmes favoritos
            for (const movie of data) {
              // Buscar detalhes adicionais do filme
              this.tmdbService.getMovieDetails(movie.id).subscribe((movieData) => {
                // Evitar duplicação
                if (!this.favoritesMovies.find(movie => movie.id === movieData.id)) {
                  this.favoritesMovies.push(movieData);
                }
              });
            }
  
            // Forçar a detecção de mudanças
            this.cdr.detectChanges();
          });
        } catch (error) {
          console.error('Erro ao obter os favoritos:', error);
        }
      }
    });
  }

  async getFavoritesTV() {
    this.authService.User$.subscribe(async (user) => {
      if (user) {
        try {
          this.dbService.getFavoritesTv(user.uid).subscribe((data) => {
            console.log(data);
  
            this.favoritesTvs = [];  // Limpa a lista de séries
  
            // Loop pelas séries favoritas
            for (const tv of data) {
              // Buscar detalhes adicionais da série
              this.tmdbService.getTvDetails(tv.id).subscribe((tvData) => {
                // Evitar duplicação
                if (!this.favoritesTvs.find(tvItem => tvItem.id === tvData.id)) {
                  this.favoritesTvs.push(tvData);
                }
              });
            }
  
            // Forçar a detecção de mudanças
            this.cdr.detectChanges();
          });
        } catch (error) {
          console.error('Erro ao obter os favoritos:', error);
        }
      }
    });
  }
  

  async getList() {
    this.authService.User$.subscribe(async (user) => {
      if (user) {
        try {
          this.dbService.getList(user.uid).subscribe((data) => {
            console.log("Dados recebidos:", data); // Verifique o que está chegando
  
            this.movieList = [];
            this.tvList = [];
  
            // Adicionando os itens sem duplicar
            data.forEach((item) => {
              const mediaId = item.id; // Pegamos o ID dentro de cada objeto
              const mediaTitle = item.mediaTitle; // Pegando o título da mídia
              const mediaType = item.mediaType; // Pegando o tipo de mídia (movie ou tv)
  
              console.log(`Processando ${mediaType}: ${mediaTitle} (ID: ${mediaId})`); // Debug para ver o ID e tipo
  
              if (mediaType === 'movie') {
                // Verifique se o mediaId é um número válido
                if (mediaId && !isNaN(Number(mediaId))) {
                  this.tmdbService.getMovieDetails(mediaId).subscribe(
                    (movieData) => {
                      if (!this.movieList.find(movie => movie.id === movieData.id)) {
                        this.movieList.push(movieData);
                      }
                    },
                    (error) => {
                      console.error('Erro ao obter detalhes do filme:', error);
                    }
                  );
                } else {
                  console.error(`ID de filme inválido: ${mediaId}`);
                }
              } else if (mediaType === 'tv') {
                // Verifique se o mediaId é um número válido
                if (mediaId && !isNaN(Number(mediaId))) {
                  this.tmdbService.getTvDetails(mediaId).subscribe(
                    (tvData) => {
                      if (!this.tvList.find(tv => tv.id === tvData.id)) {
                        this.tvList.push(tvData);
                      }
                    },
                    (error) => {
                      console.error('Erro ao obter detalhes da série:', error);
                    }
                  );
                } else {
                  console.error(`ID de série inválido: ${mediaId}`);
                }
              }
            });
  
            // Forçando a detecção de mudanças
            this.cdr.detectChanges();
          });
        } catch (error) {
          console.error('Erro ao obter os favoritos:', error);
        }
      }
    });
  }
  
  getUser() {
    this.authService.User$.subscribe(user => {
      if (user) {
        this.userEmail = user.email; // Atribui o email do usuário autenticado a uma variável
        console.log('Email do usuário:', this.userEmail);
      } else {
        console.log('Usuário não autenticado.');
      }
    });
  }
  

}

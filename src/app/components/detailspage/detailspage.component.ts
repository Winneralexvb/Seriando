import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db/db.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.scss'],
})
export class DetailspageComponent implements OnInit {
  itemDetails: any;
  watchProviders: any; // Para os provedores de onde assistir
  cast: any[] = []; // Para o elenco
  recommendations: any[] = []; // Para as recomendações
  mediaType!: 'movie' | 'tv'; // Tipo de mídia (filme ou série)
  isFavorite = false;
  isInList = false;

  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private dbService: DbService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.mediaType = this.route.snapshot.paramMap.get('mediaType') as 'movie' | 'tv'; // Obtendo o tipo de mídia da URL

    this.loadItemDetails(id);
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
  }

  closePage() {
    this.navCtrl.back(); // Volta para a página anterior
  }



  loadItemDetails(id: number) {
    // Carregar os detalhes do item (filme ou série)
    this.tmdbService.getMediaDetails(id, this.mediaType).subscribe((data) => {
      this.itemDetails = data;
    });

    // Carregar os provedores de onde assistir
    this.tmdbService.getWatchProviders(this.mediaType, id).subscribe((data) => {
      this.watchProviders = data;
    });

    // Carregar o elenco
    this.tmdbService.getCredits(this.mediaType, id).subscribe((data) => {
      this.cast = data.cast;
    });

    // Carregar as recomendações
    this.tmdbService.getRecommendations(this.mediaType, id).subscribe((data) => {
      this.recommendations = data.results;
    });

  }

  addFavoriteMovie(mediaID: string, title: string){
    this.authService.User$.subscribe( data => {
      this.dbService.addFavoriteMovie(data?.uid, mediaID, title);
    })
  }

  addFavoriteTv(mediaID: string, title: string){
    this.authService.User$.subscribe( data => {
      this.dbService.addFavoriteTV(data?.uid, mediaID, title);
    })
  }

  addFavorite(mediaId: string, mediaType: string, title: string){
    if (mediaType === 'movie'){
      this.addFavoriteMovie(mediaId, title)
    } else if( mediaType === 'tv'){
      this.addFavoriteTv(mediaId, title)
    }else {
      console.warn('Tipo de mídia desconhecido!');
    }

    this.isFavorite = true;
  }

  addToList(mediaID: string, mediaType: 'movie' | 'tv', mediaTitle: string){
    this.authService.User$.subscribe( data => {
      this.dbService.addList(data?.uid, mediaID, mediaTitle, mediaType);
    })

    this.isInList = true;
  }

  removeFromFavoriteMovies(mediaID: string){
    this.authService.User$.subscribe( data => {
      this.dbService.removeFromFavoriteMovies(data?.uid, mediaID);
    })
    console.log('chegou aqui hehe');
    this.isFavorite = false;
  }
}

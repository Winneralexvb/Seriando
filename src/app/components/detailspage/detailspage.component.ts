import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { NavController } from '@ionic/angular';

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

  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private tmdbService: TmdbService
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

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
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
}

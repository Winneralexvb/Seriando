import { Component, OnInit } from '@angular/core';
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
  favorites: any[] = [];

  constructor(private navCtrl: NavController, private tmdbService: TmdbService, private authService: AuthService, private dbService: DbService) {}

  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  ngOnInit() {
    this.loadBackdropImages();
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

  async getFavorites() {
    this.authService.User$.subscribe(async (user) => {
      if (user) {
        try {
          this.dbService.getFavorites(user.uid).subscribe((data) => {
            for (const movieId of data) {
              this.tmdbService.getMovieDetails(movieId).subscribe((movieData) => {
                this.favorites.push(movieData);
                console.log(this.favorites);
                console.log(movieData);
              });
            }
          });
        } catch (error) {
          console.error('Erro ao obter os favoritos:', error);
        }
      }
    });
  }

}

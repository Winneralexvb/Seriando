import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TmdbService } from '../services/tmdb.service';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {
  backdrops: any[] = [];

  constructor(private navCtrl: NavController, private tmdbService: TmdbService) {}

  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  ngOnInit() {
    this.loadBackdropImages();
  }

  navigate(page: string) {
    this.navCtrl.navigateRoot(`${page}`);
  }

  loadBackdropImages() {
    const seriesId = 94997; // Exemplo de ID de série (The Walking Dead)
    this.tmdbService.getBackdropImages('tv', seriesId).subscribe((data: any) => {
      this.backdrops = data.backdrops.filter((image: any) => image.iso_639_1 === null);
    });
  }

}

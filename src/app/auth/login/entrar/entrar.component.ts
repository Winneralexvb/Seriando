import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.scss'],
})
export class EntrarComponent  implements OnInit {

  constructor(private navCtrl:NavController) { }

  ngOnInit() {}

  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }


  goBack() {
    this.navCtrl.back();
  }

}

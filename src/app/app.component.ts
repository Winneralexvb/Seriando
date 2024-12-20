import { Component } from '@angular/core';

import { register } from 'swiper/element/bundle';
import { AuthService } from './services/auth/auth.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private auth: AuthService){}

  ngOnInit() {
    this.auth.getProfile().then((user => {
      this.auth.User$.next(user);
      console.log(user);
    }))
  }
}

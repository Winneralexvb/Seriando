import { Component, inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  @Input() movieUrl!: Number;
  @Input() imageUrl!: any;
  @Input() title!: string;

  modifiedImageUrl!: string;

  ngOnInit() {

    this.modifiedImageUrl = this.imageUrl.startsWith('https://') 
      ? this.imageUrl 
      : `https://image.tmdb.org/t/p/w500/${this.imageUrl}`;

      console.log('Chegoi aqui', this.title)
  }

}

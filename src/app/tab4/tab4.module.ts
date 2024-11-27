import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { CardListComponent } from './card-list/card-list.component';

import { IonicModule } from '@ionic/angular';

import { Tab4PageRoutingModule } from './tab4-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tab4Page } from './tab4.page';
import { DetailspageComponent } from '../components/detailspage/detailspage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
  ],
  declarations: [Tab4Page, CardListComponent, CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CardListComponent, CardComponent]
})
export class Tab4PageModule { }

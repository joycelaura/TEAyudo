import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemaPageRoutingModule } from './tema-routing.module';

import { TemaPage } from './tema.page';

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemaPageRoutingModule,
    SharedModule,
  ],
  declarations: [TemaPage]
})
export class TemaPageModule {}

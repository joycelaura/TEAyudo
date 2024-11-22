import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmocionesPageRoutingModule } from './emociones-routing.module';

import { EmocionesPage } from './emociones.page';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmocionesPageRoutingModule,
    SharedModule
],
  declarations: [EmocionesPage]
})
export class EmocionesPageModule {}

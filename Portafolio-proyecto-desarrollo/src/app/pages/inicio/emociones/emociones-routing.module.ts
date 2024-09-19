import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmocionesPage } from './emociones.page';

const routes: Routes = [
  {
    path: '',
    component: EmocionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmocionesPageRoutingModule {}

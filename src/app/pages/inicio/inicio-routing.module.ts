import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { InicioPage } from "./inicio.page";

const routes: Routes = [
  {
    path: "",
    component: InicioPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfilePageModule),
      },
    ],
  },
  {
    path: 'emociones',
    loadChildren: () => import('./emociones/emociones.module').then( m => m.EmocionesPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./calendario/calendario.module').then( m => m.CalendarioPageModule)
  },
  {
    path: 'tema',
    loadChildren: () => import('./tema/tema.module').then( m => m.TemaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}

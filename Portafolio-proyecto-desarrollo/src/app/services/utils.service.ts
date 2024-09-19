import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  loading() {
    return this.loadingCtrl.create({ spinner: "crescent" });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // enruta a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // guardar elementos en localstorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // obtiene un elemento desde localstorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  // modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  // ocultar modal
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  //obtener Fecha y Hora
  getDate(): string{
    const fechaHoraActual = new Date();
    // Hace que de la variable tipo date retorne como un string y solo la parte de la hora
    return fechaHoraActual.toLocaleTimeString();
  }
}
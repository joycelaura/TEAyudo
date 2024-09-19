import { Component, OnInit, inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/models/user.model";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";

import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  firebaseSvc = inject(FirestoreService);
  utilsSvc = inject(UtilsService);
  showPassword: boolean = false;

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: "primary",
            position: "middle",
            icon: "alert-circle-outline",
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          this.utilsSvc.saveInLocalStorage("user", user);
          this.utilsSvc.routerLink("/inicio/home");
          this.form.reset();

          this.utilsSvc.presentToast({
            message: `te damos la bienvenida ${user.nombre}`,
            duration: 1500,
            color: "primary",
            position: "middle",
            icon: "person-circle-outline",
          });
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: "primary",
            position: "middle",
            icon: "alert-circle-outline",
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordFieldType() {
    return this.showPassword ? 'text' : 'password';
  }
}

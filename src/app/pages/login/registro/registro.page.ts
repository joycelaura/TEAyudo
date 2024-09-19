import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirestoreService } from "src/app/services/firestore.service";
import { User } from "src/app/models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.page.html",
  styleUrls: ["./registro.page.scss"],
})
export class RegistroPage {
  registerForm: FormGroup;
  mostrarContrasena: boolean = false; 
  mostrarConfirmarContrasena: boolean = false;

  constructor(
    private toastController: ToastController,
    private firestoreSvc: FirestoreService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      contrasena: new FormControl(null, [ Validators.required, Validators.minLength(6),]),
      confirmar_contrasena: new FormControl(null, Validators.required),
    });
  }

  isFocused = false;

  onFocus() {
    this.isFocused = true;
}

  
  async validarFormulario() {
    const emailExists = await this.firestoreSvc.emailExists(
      this.registerForm.value.correo
    );
    if (this.registerForm.controls["correo"].invalid) {
    } else if (this.registerForm.controls["contrasena"].invalid) {
    } else if (!this.registerForm.valid) {
    } else if (
      this.registerForm.value.contrasena !==
      this.registerForm.value.confirmar_contrasena
    ) {
    } else {
      if (emailExists) {
          this.mostrarAdvertencia("Este email ya esta en uso!");
      } else {
        const user: User = {
          uid: "",
          nombre: this.registerForm.value.nombre,
          //rut: this.registerForm.value.rut,
          password: this.registerForm.value.contrasena,
          email: this.registerForm.value.correo,
          //telefono: this.registerForm.value.telefono,
        };
        this.firestoreSvc.signUp(user).then((res) => {
          console.log(res);
          this.mostrarNotificacionBuena("¡Cuenta Registrada con Éxito! :)");
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000); // 3000 milisegundos (3 segundos)
        });
      }
    }
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  toggleMostrarConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  async mostrarNotificacionBuena(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
      color: "success",
    });
    toast.present();
  }

  async mostrarAdvertencia(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
      color: "warning",
    });
    toast.present();
  }
  
}
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
      contrasena: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmar_contrasena: new FormControl(null, Validators.required),
      telefono: new FormControl(null, [
        Validators.required,
        Validators.maxLength(12),
      ]),
    });
  }

  async validarFormulario() {
    // Verificar si el formulario es válido
    if (this.registerForm.invalid) {
      this.mostrarAdvertencia("Por favor, complete todos los campos correctamente.");
      return;
    }

    // Verificar si las contraseñas coinciden
    if (this.registerForm.value.contrasena !== this.registerForm.value.confirmar_contrasena) {
      this.mostrarAdvertencia("Las contraseñas no coinciden.");
      return;
    }

    // Verificar si el email ya existe
    const emailExists = await this.firestoreSvc.emailExists(this.registerForm.value.correo);
    if (emailExists) {
      this.mostrarAdvertencia("Este email ya está en uso!");
      return;
    }

    // Registrar el usuario
    const user: User = {
      uid: "",
      nombre: this.registerForm.value.nombre,
      password: this.registerForm.value.contrasena,
      email: this.registerForm.value.correo,
      telefono: this.registerForm.value.telefono,
    };

    this.firestoreSvc.signUp(user).then((res) => {
      console.log(res);
      this.mostrarNotificacionBuena("¡Cuenta Registrada con Éxito! :)");
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 3000);
    });
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

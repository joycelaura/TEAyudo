import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { IonInput } from "@ionic/angular";
import { User } from "firebase/auth";
import { FirestoreService } from "src/app/services/firestore.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: User;

  @ViewChild("nombreInput") nombreInput: IonInput | undefined;
  @ViewChild("contrasenaInput") contrasenaInput: IonInput | undefined;
  @ViewChild("correoInput") correoInput: IonInput | undefined;


  router = inject(Router);
  firebaseSvc = inject(FirestoreService);

  nombre: string = "";
  password: string = "";
  correo: string = "";
  isEditable = true;

  constructor(
    private firestoreSvc: FirestoreService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.firestoreSvc.auth.onAuthStateChanged((user) => {
      if (user) {
        this.firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .subscribe((snapshot) => {
            let userData = snapshot.data() as any; // Afirmación de tipo
            this.nombre = userData.nombre;
            this.password = userData.password;
            this.correo = userData.email;
          });
      }
    });
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
  }

  //==========cerrar sesion============
  signOut() {
    this.firebaseSvc.signOut();
  }
}

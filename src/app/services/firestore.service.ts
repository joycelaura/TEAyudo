import { Injectable, inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getFirestore, setDoc, getDoc, doc } from "@angular/fire/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { User } from "../models/user.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UtilsService } from "./utils.service";
import { firstValueFrom } from "rxjs";
import { Emotion } from "../models/emotion.model";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Importar Firestore para usar FieldValue
@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  userEmail: string | null = null;

  constructor() {}

  // AUTENTICACION
  getAuth() {
    return getAuth();
  }

  // cerrar sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem("user");
    this.utilsSvc.routerLink("/login");
  }

  // ACCEDER
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
      .then((result) => {
        // Guardar el email del usuario autenticado
        user.email = result.user?.email || '';
        localStorage.setItem('user', JSON.stringify(user));
        return result;
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        throw error;
      });
  }

  // Registrarse
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
      .then((result) => {
        return this.firestore.collection("users").doc(result.user.uid).set({
          nombre: user.nombre,
          email: user.email,
          password: user.password,
          telefono: user.telefono,
        });
      });
  }

  // Validador si correo existe
  async emailExists(email: string): Promise<boolean> {
    const docRef = this.firestore.collection("users", (ref) =>
      ref.where("email", "==", email)
    );
    const docSnap = await firstValueFrom(docRef.get());
    return docSnap.size > 0;
  }

  // enviar email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // setear un documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Obtener documentos
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  
  // Guardar o actualizar el contador de emociones en Firestore
  async saveEmotionCount(email: string, emotion: Emotion) {
    const emotionPath = `emotions/${email}/emotions/${emotion.name}`;

    this.firestore.doc(emotionPath).set({
      count: firebase.firestore.FieldValue.increment(1), // Incrementar el contador en 1
      lastUpdated: new Date(),
    }, { merge: true })
    .then(() => {
      console.log(`${emotion.name} count updated successfully for user ${email}`);
    })
    .catch((error) => {
      console.error("Error updating emotion count:", error);
    });
  }

  // Obtener los contadores de emociones desde Firestore
  async getEmotionCount(email: string): Promise<Emotion[]> {
    const docRef = this.firestore.collection('emotions').doc(email);
    const docSnap = await docRef.get().toPromise();

    if (docSnap.exists) {
      const emotions = docSnap.data() as { [key: string]: any };
      return Object.keys(emotions).map(key => ({
        name: key,
        count: emotions[key].count,
        lastUpdated: emotions[key].lastUpdated.toDate()
      }));
    } else {
      return [];
    }
  }
}

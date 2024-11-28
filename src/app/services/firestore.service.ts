import { Injectable, inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getFirestore, setDoc, getDoc, doc, collection, query, where } from "@angular/fire/firestore";
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
        localStorage.setItem('userEmail', user.email); // Guarda el email en localStorage
        console.log('Email guardado en localStorage:', user.email); // Verificación
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
async saveEmotionCount(email: string, emotion: string, dateKey: string) {
  const emotionPath = `emotions/${email}/days/${dateKey}`;
  const emotionField = `${emotion}.count`;

  await this.firestore.doc(emotionPath).set({
    [emotionField]: firebase.firestore.FieldValue.increment(1),
    [`${emotion}.lastUpdated`]: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true })
  .then(() => {
    console.log(`${emotion} count updated for ${dateKey}`);
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


    return Object.keys(emotions).map(key => {
      // Suponiendo que la clave es una fecha como "2024-11-01"
      const [year, month, day] = key.split('-').map(num => parseInt(num, 10));

      return {
        email: email,      // Email del usuario
        name: 'joy',       // Aquí puedes agregar el nombre de la emoción (por ejemplo, 'joy')
        count: emotions[key].count,
        lastUpdated: emotions[key].lastUpdated.toDate(),
        year: year,
        month: month,
        day: day
      };
    });
  } else {
    return [];
  }
}
// Obtener las emociones de un mes específico
async getEmotionsByMonth(email: string, year: number, month: number): Promise<{ [key: string]: Emotion[] }> {
  const emotionsByDay: { [key: string]: Emotion[] } = {};
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const daysCollection = this.firestore.collection(`emotions/${email}/days`, ref =>
    ref.where(firebase.firestore.FieldPath.documentId(), '>=', this.formatDate(startDate))
       .where(firebase.firestore.FieldPath.documentId(), '<=', this.formatDate(endDate))
  );

  const snapshot = await daysCollection.get().toPromise();

  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      const data = doc.data();
      const dateKey = doc.id;
      const emotions: Emotion[] = [];

      for (const [key, value] of Object.entries(data)) {
        if (key.endsWith('.count')) {
          const emotionName = key.replace('.count', '');
          emotions.push({
            name: emotionName,
            count: value as number,
            lastUpdated: data[`${emotionName}.lastUpdated`]?.toDate() || new Date(),
            email,
            year,
            month: month + 1,
            day: parseInt(dateKey.split('-')[2]), // Extraer día del id
          });
        }
      }

      if (emotions.length > 0) {
        emotionsByDay[dateKey] = emotions;
      }
    });
  } else {
    console.warn('No emotions found for the selected range');
  }

  console.log('Emociones organizadas por día:', emotionsByDay); // Log para depuración
  return emotionsByDay;
}

async getMostFrequentEmotionOfMonth(email: string, year: number, month: number): Promise<Emotion | null> {
  const emotionsByDay = await this.getEmotionsByMonth(email, year, month); // Obtiene las emociones del mes
  
  const emotionCount: { [key: string]: number } = {};

  // Contamos la cantidad de veces que aparece cada emoción en todo el mes
  for (const day in emotionsByDay) {
    emotionsByDay[day].forEach((emotion) => {
      if (emotionCount[emotion.name]) {
        emotionCount[emotion.name]++;
      } else {
        emotionCount[emotion.name] = 1;
      }
    });
  }

  // Determinamos cuál es la emoción más frecuente
  let mostFrequentEmotion: Emotion | null = null;
  let maxCount = 0;

  for (const emotionName in emotionCount) {
    if (emotionCount[emotionName] > maxCount) {
      mostFrequentEmotion = {
        name: emotionName,
        count: emotionCount[emotionName],
        lastUpdated: new Date(),
        email,
        year,
        month,
        day: 0,
      };
      maxCount = emotionCount[emotionName];
    }
  }

  return mostFrequentEmotion; // Devuelve la emoción más frecuente
}

// Función auxiliar para formatear fechas
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


}
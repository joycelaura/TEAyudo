import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/models/user.model';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";

@Component({
  selector: 'app-emociones',
  templateUrl: './emociones.page.html',
  styleUrls: ['./emociones.page.scss'],
})
export class EmocionesPage implements OnInit {

  emotions: Emotion[] = [];    // lista de emociones
  userEmail: string | null = null;

  constructor(private firestoreSvc: FirestoreService, private auth: AngularFireAuth, private themeService: ThemeService) { }

  async ngOnInit() {
    this.applyStoredTheme();
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userEmail = user.email;
      console.log("User authenticated:", this.userEmail);
      this.loadEmotionCounts();
    } else {
      console.log("No user is logged in.");
    }
  }
  async applyStoredTheme() {
    const currentTheme = this.themeService.getCurrentTheme();
    document.body.classList.add(currentTheme);
  }

  onEmotionClick(emotion: string) {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const today = new Date();
      const dateKey = this.formatDate(today);
      this.firestoreSvc.saveEmotionCount(email, emotion, dateKey);
    } else {
      console.log("No se encontró email en el localStorage.");
    }
  }

  // Función auxiliar para formatear fechas
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
async loadEmotionCounts() {
    if (this.userEmail) {
      this.emotions = await this.firestoreSvc.getEmotionCount(this.userEmail);
      console.log("Emotions loaded:", this.emotions);
    }
  }
}
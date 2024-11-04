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

  async onEmotionClick(emotionName: string) {
    const emotion: Emotion = {
      name: emotionName,
      count: 1,  // Valor inicial, pero este se incrementará en Firestore
      lastUpdated: new Date()
    };

    if (this.userEmail) {
      await this.firestoreSvc.saveEmotionCount(this.userEmail, emotion);
      this.loadEmotionCounts();  // Recargar los contadores
    } else {
      console.log("No user authenticated.");
    }
  }

  async loadEmotionCounts() {
    if (this.userEmail) {
      this.emotions = await this.firestoreSvc.getEmotionCount(this.userEmail);
      console.log("Emotions loaded:", this.emotions);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/models/user.model';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-emociones',
  templateUrl: './emociones.page.html',
  styleUrls: ['./emociones.page.scss'],
})
export class EmocionesPage implements OnInit {
  emotions: Emotion[] = []; // lista de emociones
  userEmail: string | null = null;

  // Define los archivos de sonido para cada emoción
  private audioIra = new Audio('assets/sounds/ira.mp3');
  private audioAlegria = new Audio('assets/sounds/alegria.mp3');
  private audioTristeza = new Audio('assets/sounds/tristeza.mp3');
  private audioMiedo = new Audio('assets/sounds/miedo.mp3');
  private audioAgrado = new Audio('assets/sounds/agrado.mp3');
  private audioVerguenza = new Audio('assets/sounds/verguenza.mp3');
  private audioContencion = new Audio('assets/sounds/contencion.mp3');
  private audioSoledad = new Audio('assets/sounds/soledad.mp3');

  constructor(
    private firestoreSvc: FirestoreService, 
    private auth: AngularFireAuth, 
    private themeService: ThemeService, 
    private audioService: AudioService
  ) { }

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

  // Contador de emociones y reproducción de sonido
  onEmotionClick(emotion: string) {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const today = new Date();
      const dateKey = this.formatDate(today);
      this.firestoreSvc.saveEmotionCount(email, emotion, dateKey);

      // Reproduce el sonido correspondiente según la emoción
      this.playEmotionSound(emotion);
    } else {
      console.log("No se encontró email en el localStorage.");
    }
  }

  // Método para reproducir el sonido correspondiente según la emoción
  private playEmotionSound(emotion: string) {
    switch (emotion) {
      case 'ira':
        this.audioIra.play();
        break;
      case 'alegria':
        this.audioAlegria.play();
        break;
      case 'tristeza':
        this.audioTristeza.play();
        break;
      case 'miedo':
        this.audioMiedo.play();
        break;
      case 'agrado':
        this.audioAgrado.play();
        break;
      case 'verguenza':
        this.audioVerguenza.play();
        break;
      case 'contencion':
        this.audioContencion.play();
        break;
      case 'soledad':
        this.audioSoledad.play();
        break;
      default:
        console.error('Emoción no reconocida:', emotion);
        break;
    }
  }

  // Función auxiliar para formatear fechas
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Contador de emociones, registro en Firebase
  async loadEmotionCounts() {
    if (this.userEmail) {
      this.emotions = await this.firestoreSvc.getEmotionCount(this.userEmail);
      console.log("Emotions loaded:", this.emotions);
    }
  }

  // Función para reproducir un sonido de clic genérico
  playClickSound() {
    this.audioService.playSound('click');
  }
}
 
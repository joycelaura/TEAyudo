import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Emotion } from 'src/app/models/emotion.model';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  days: number[] = [];
  currentMonth: number = new Date().getMonth();  // Inicializar con el mes actual
  currentYear: number = new Date().getFullYear();  // Inicializar con el año actual
  monthEmotions: { [key: string]: Emotion[] } = {};

  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  yearRange: number[] = [];

  constructor(private firestoreSvc: FirestoreService) {}

  ngOnInit() {
    this.generateYearRange();  // Generar el rango de años
    this.generateCalendar();    // Generar el calendario con el mes y año actuales
  }

  // Generar un rango de años para el selector de años
  generateYearRange() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;  // Año inicial
    const endYear = currentYear + 10;  // Año final (ajústalo según lo necesites)

    for (let year = startYear; year <= endYear; year++) {
      this.yearRange.push(year);
    }
  }

  // Generar el calendario basado en el mes y año seleccionados
  async generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const email = localStorage.getItem('userEmail');
    if (email) {
      this.monthEmotions = await this.firestoreSvc.getEmotionsByMonth(email, this.currentYear, this.currentMonth);
    }
  }
  // Actualizar el calendario cuando el usuario cambia mes o año
  updateCalendar() {
    this.generateCalendar();
  }

  // Navegar al siguiente mes
  nextMonth() {
    this.currentMonth = (this.currentMonth + 1) % 12;
    if (this.currentMonth === 0) {
      this.currentYear += 1;
    }
    this.generateCalendar();
  }

  // Navegar al mes anterior
  prevMonth() {
    this.currentMonth = (this.currentMonth - 1 + 12) % 12;
    if (this.currentMonth === 11) {
      this.currentYear -= 1;
    }
    this.generateCalendar();
  }

  // Obtener el ícono de la emoción dominante para un día específico
  getDominantEmotionIcon(day: number): string | null {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const emotions = this.monthEmotions[dateKey];

    if (emotions && emotions.length > 0) {
      const dominantEmotion = emotions.reduce((prev, current) => (prev.count > current.count) ? prev : current);
      return `assets/svg_emo/${dominantEmotion.name}.svg`;
    }
    return null;
  }
}
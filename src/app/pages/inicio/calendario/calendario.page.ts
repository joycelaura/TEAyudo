import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";

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

  weekDays: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];  // Días de la semana

  calendarDays: any[] = [];  // Arreglo para organizar los días en semanas

  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  yearRange: number[] = [];

  constructor(private firestoreSvc: FirestoreService, private themeService: ThemeService) {}

  ngOnInit() {
    this.generateYearRange();  // Generar el rango de años
    this.generateCalendar();    // Generar el calendario con el mes y año actuales
  }
  async applyStoredTheme() {
    const currentTheme = this.themeService.getCurrentTheme();
    document.body.classList.add(currentTheme);
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
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    let firstDayIndex = firstDayOfMonth.getDay(); // Día de la semana del primer día del mes

    // Ajustar para que el primer día de la semana comience en lunes (si es necesario)
    firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1; // Ajuste si el primer día es domingo

    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);  // Crear array con los días del mes

    this.calendarDays = [];  // Resetear la lista de semanas

    let week: any[] = [];  // Semana actual

    // Rellenar los días previos al primer día del mes con null
    for (let i = 0; i < firstDayIndex; i++) {
      week.push(null);  // Rellenar los días anteriores al primer día del mes
    }

    // Obtener emociones del usuario (si las hay)
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.monthEmotions = await this.firestoreSvc.getEmotionsByMonth(email, this.currentYear, this.currentMonth);
      console.log("Emotions loaded from Firestore:", this.monthEmotions);  // Log para verificar
    }

    // Agregar los días del mes y las emociones
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(this.currentYear, this.currentMonth, i);
      const dayIndex = currentDay.getDay();  // Día de la semana de este día

      // Agregar el día y el ícono de la emoción dominante
      week.push({ date: i, emotionIcon: await this.getDominantEmotionIcon(i) });

      // Si la semana está llena (7 días), agregarla al calendario y comenzar una nueva semana
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    // Si la última semana no está completa, agregarla
    if (week.length > 0) {
      // Completar la última semana con null hasta 7 días si es necesario
      while (week.length < 7) {
        week.push(null);
      }
      this.calendarDays.push(week);
    }
  }

  // Obtener el ícono de la emoción dominante para un día específico
  async getDominantEmotionIcon(day: number): Promise<string|null> {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const emotions = this.monthEmotions[dateKey];

    console.log(`Emotions for ${dateKey}:`, emotions);  // Log para verificar las emociones

    if (emotions && emotions.length > 0) {
      const dominantEmotion = emotions.reduce((prev, current) => (prev.count > current.count) ? prev : current);
      console.log(`Dominant emotion for ${dateKey}:`, dominantEmotion);  // Log para la emoción dominante
      return `assets/svg_emo/${dominantEmotion.name}.svg`;
    }

    console.log(`No emotions for ${dateKey}`);  // Log si no hay emociones
    return null;
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
}

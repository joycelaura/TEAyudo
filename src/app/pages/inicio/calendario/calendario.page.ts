// Declaración global de monthEmotions al inicio del archivo
export let monthEmotions: { [key: string]: Emotion[] } = {};

// Importaciones
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
<<<<<<< HEAD
import { Chart, ChartData, ChartOptions, registerables  } from 'chart.js';
=======
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit, AfterViewInit {

  @ViewChild('emotionChart') emotionChart: any; // Referencia al canvas
  chart: any; // Referencia a la instancia del gráfico

  // Datos y opciones de la gráfica
  chartData: ChartData<'bar'> = {
    labels: [], // Etiquetas de las emociones
    datasets: [{
      data: [], // Datos de las emociones
      label: 'Emociones',
      backgroundColor: '#42A5F5', // Color de las barras
      borderColor: '#1E88E5', // Color del borde de las barras
      borderWidth: 1,
    }],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Asegura que no se mantenga la relación de aspecto
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  days: number[] = [];
  currentMonth: number = new Date().getMonth();  // Inicializar con el mes actual
  currentYear: number = new Date().getFullYear();  // Inicializar con el año actual

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
    this.generateEmotionStats(); // Generar las estadísticas emocionales
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initChart(); // Inicializa el gráfico después de un breve retraso
    }, 0);
  }

  async applyStoredTheme() {
    const currentTheme = this.themeService.getCurrentTheme();
    document.body.classList.add(currentTheme);
  }

  // Inicializar el gráfico
  initChart() {
    const chartCanvas = this.emotionChart.nativeElement;
    if (chartCanvas) {
      this.chart = new Chart(chartCanvas, {
        type: 'bar',
        data: this.chartData,
        options: this.chartOptions,
      });
    }
  }
  

  // Actualizar la gráfica cuando cambian los datos
  updateChart() {
    if (this.chart) {
      this.chart.data = this.chartData;
      this.chart.update();
    }
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
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); // Total de días en el mes
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay(); // Día de la semana del primer día del mes
  
    const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ajustar domingo

    const daysArray = [];
    for (let i = 0; i < firstDayAdjusted; i++) {
      daysArray.push(null); // Días vacíos
    }
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day); // Agregar días
    }

    this.calendarDays = [];
    while (daysArray.length) {
      this.calendarDays.push(daysArray.splice(0, 7)); // Divide en semanas
    }
  
    const email = localStorage.getItem('userEmail');
    if (email) {
      monthEmotions = await this.firestoreSvc.getEmotionsByMonth(email, this.currentYear, this.currentMonth);
    }
  }

  getDominantEmotionIcon(day: number): string | null {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const emotions = monthEmotions[dateKey];

    if (emotions && emotions.length > 0) {
      const dominantEmotion = emotions.reduce((prev, current) => (prev.count > current.count) ? prev : current);
      return `assets/svg_emo/${dominantEmotion.name}.svg`;
    }
    return null;
  }

  async generateEmotionStats() {
    const emotionCounts: { [key: string]: number } = {};
    console.log(monthEmotions);
    for (const dateKey in monthEmotions) {
      const emotions = monthEmotions[dateKey];
      if (emotions) {
        emotions.forEach(emotion => {
          emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1;
        });
      }
    }

    const emotions = Object.keys(emotionCounts);
    const counts = emotions.map(emotion => emotionCounts[emotion]);

    this.chartData.labels = emotions;
    this.chartData.datasets[0].data = counts;

    this.updateChart(); // Actualizar el gráfico con los nuevos datos
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

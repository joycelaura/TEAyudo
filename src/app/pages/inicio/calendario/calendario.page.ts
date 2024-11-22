import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables  } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";



Chart.register(...registerables);

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
    // Opcional: establecer un tamaño específico
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  


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
    this.generateEmotionStats(); // Generar las estadísticas emocionales
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.monthEmotions) {
        this.initChart(); // Inicializa el gráfico solo si ya hay datos de emociones
      }
    }, 0);
  }
  

  async applyStoredTheme() {
    const currentTheme = this.themeService.getCurrentTheme();
    document.body.classList.add(currentTheme);
  }
  
    initChart() {
      if (this.chart) {
        this.chart.destroy(); // Destruye la gráfica previa si existe
      }
    
      this.chart = new Chart(this.emotionChart.nativeElement, {
        type: 'bar',
        data: {
          labels: this.chartData.labels, // Etiquetas
          datasets: [
            {
              label: 'Emociones',
              data: this.chartData.datasets[0].data, // Valores
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores de barras
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category', // Asegúrate de registrar esta escala
              title: {
                display: true,
                text: 'Emociones',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Conteo',
              },
            },
          },
        },
      });
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
  
    // Ajustar el primer día para que la semana comience en lunes
    const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Si es domingo (0), ajustamos a 6 (sábado)
  
    // Crear un array de días con días vacíos al inicio según el primer día de la semana
    const daysArray = [];
    for (let i = 0; i < firstDayAdjusted; i++) {
      daysArray.push(null); // Rellenamos con null para los días vacíos antes del 1 del mes
    }
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day); // Agregar los días del mes
    }
  
    // Dividir los días en semanas (array de arrays)
    this.calendarDays = [];
    while (daysArray.length) {
      this.calendarDays.push(daysArray.splice(0, 7)); // Divide en semanas (7 días por semana)
    }
  
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.monthEmotions = await this.firestoreSvc.getEmotionsByMonth(email, this.currentYear, this.currentMonth);
      console.log('Emociones del mes:', this.monthEmotions);  // Verifica aquí que se obtienen emociones
    }
  }
  
  

  getDominantEmotionIcon(day: number): string | null {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const emotions = this.monthEmotions[dateKey];

    if (emotions && emotions.length > 0) {
      const dominantEmotion = emotions.reduce((prev, current) => (prev.count > current.count) ? prev : current);
      return `assets/svg_emo/${dominantEmotion.name}.svg`;
    }
    return null;
  }

  async generateEmotionStats() {
    const emotionCounts: { [key: string]: number } = {};
  
    // Iterar sobre cada día
    for (const dateKey in this.monthEmotions) {
      const emotions = this.monthEmotions[dateKey]; // Array de emociones para esa fecha
      if (emotions && Array.isArray(emotions)) {
        emotions.forEach((emotion: any) => {
          const emotionName = emotion.name; // Asegúrate de que este campo exista
          if (emotionName) {
            emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
          }
        });
      }
    }
  
    console.log('Conteo de emociones:', emotionCounts);
  
    if (Object.keys(emotionCounts).length === 0) {
      console.warn('No hay datos para mostrar en el gráfico.');
      return;
    }
  
    // Actualiza los datos de la gráfica
    this.chartData.labels = Object.keys(emotionCounts);
    this.chartData.datasets[0].data = Object.values(emotionCounts);
  
    this.updateChart(); // Forzar actualización del gráfico
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
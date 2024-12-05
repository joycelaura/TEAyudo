// Declaración global de monthEmotions al inicio del archivo
export let monthEmotions: { [key: string]: Emotion[] } = {};

// Importaciones
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Emotion } from 'src/app/models/emotion.model';
import { ThemeService } from "src/app/services/theme.service";
import { ModalController } from '@ionic/angular';


Chart.register(...registerables);

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit, AfterViewInit {
  advice: string | null = null;
  mostFrequentEmotion: string | null = null;
  selectedTheme: string;

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

  constructor(private firestoreSvc: FirestoreService, private themeService: ThemeService, private modalController:ModalController) {
    this.selectedTheme = this.themeService.getCurrentTheme();
  }
  onThemeChange() {
    this.themeService.setTheme(this.selectedTheme);
  }
  ngOnInit() {
    this.applyStoredTheme();
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
      console.log('Datos cargados en monthEmotions:', monthEmotions); // Depuración
      await this.generateEmotionStats();
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
  
  // Generar estadísticas emocionales y actualizar el gráfico
  async generateEmotionStats() {
    console.log('monthEmotions:', monthEmotions);

    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('Email not found in localStorage.');
        return;
      }

      const emotionCounts: { [key: string]: number } = {};

      for (const dateKey in monthEmotions) {
        const emotions = monthEmotions[dateKey];
        emotions.forEach(emotion => {
          emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + emotion.count;
        });
      }

      // Crear etiquetas y datos para el gráfico
      const emotions = Object.keys(emotionCounts);
      const counts = emotions.map(emotion => emotionCounts[emotion]);

      // Asignar datos al gráfico
      this.chartData.labels = emotions;
      this.chartData.datasets[0].data = counts;

      console.log('Datos para el gráfico:', this.chartData);
      this.updateChart();

      // Calcular la emoción más frecuente
      this.mostFrequentEmotion = this.getMostFrequentEmotion(emotionCounts);
      console.log('Emoción más frecuente:', this.mostFrequentEmotion);

      // Obtener el consejo basado en la emoción más frecuente
      this.advice = this.getAdviceForEmotion(this.mostFrequentEmotion);

    } catch (error) {
      console.error('Error generating emotion stats:', error);
    }
  }

// Función para calcular la emoción más frecuente
  getMostFrequentEmotion(emotionCounts: { [key: string]: number }): string {
    return Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
  }  

  // Función para obtener el consejo según la emoción más frecuente
  getAdviceForEmotion(emotion: string | null): string {
    switch (emotion) {
      case 'ira':
        return 'Tómate un tiempo para calmarte y reflexionar.';
      case 'alegria':
        return 'Comparte tu alegría con los demás.';
      case 'tristeza':
        return 'Habla con alguien de confianza.';
      case 'miedo':
        return 'Haz una pausa y respira profundo.';
      case 'agrado':
        return 'Aprovecha este buen momento.';
      case 'verguenza':
        return 'Recuerda que todos cometemos errores.';
      case 'soledad':
        return 'Busca apoyo, no estás solo.';
      case 'contencion':
        return 'Esta bien pedir ayuda, un abrazo nos viene bien a todos';
      default:
        return 'Mantén la calma y sigue adelante.';
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
}
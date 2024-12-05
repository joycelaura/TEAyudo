import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CalendarioPage } from './calendario.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ThemeService } from 'src/app/services/theme.service';
import { of } from 'rxjs';

describe('CalendarioPage', () => {
  let component: CalendarioPage;
  let fixture: ComponentFixture<CalendarioPage>;

  let firestoreServiceMock: any;
  let themeServiceMock: any;

  beforeEach(waitForAsync(() => {
    // Mock del servicio Firestore
    firestoreServiceMock = jasmine.createSpyObj('FirestoreService', ['getEmotionsByMonth']);
    firestoreServiceMock.getEmotionsByMonth.and.returnValue(of({}));

    // Mock del servicio Theme
    themeServiceMock = jasmine.createSpyObj('ThemeService', ['getCurrentTheme', 'setTheme']);
    themeServiceMock.getCurrentTheme.and.returnValue('light');

    TestBed.configureTestingModule({
      declarations: [CalendarioPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: ThemeService, useValue: themeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el tema correctamente', () => {
    spyOn(component, 'applyStoredTheme');
    component.ngOnInit();
    expect(component.applyStoredTheme).toHaveBeenCalled();
    expect(component.selectedTheme).toBe('light');
  });

  it('debería aplicar el tema de fondo correcto al contenido', () => {
    const content = fixture.nativeElement.querySelector('ion-content');
    const toolbar = fixture.nativeElement.querySelector('ion-toolbar');
    
    // Verificar si los estilos de fondo están aplicándose correctamente
    expect(content.style.backgroundColor).toBe('var(--ion-background-color)');
    expect(toolbar.style.backgroundColor).toBe('var(--ion-background-color)');
  });

  it('debería aplicar el estilo de la cuadrícula del calendario', () => {
    const calendarGrid = fixture.nativeElement.querySelector('.calendar-grid');
    
    // Verificar si la cuadrícula se ha configurado con el estilo correcto
    expect(calendarGrid.style.display).toBe('flex');
    expect(calendarGrid.style.justifyContent).toBe('center');
  });

  it('debería verificar los estilos responsivos de la cuadrícula de días', () => {
    const calendarGrid = fixture.nativeElement.querySelector('.calendar-grid');
    
    // Cambiar el tamaño de la ventana para simular un cambio en el tamaño de la pantalla
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    
    // Verificar si el número de columnas cambia según el tamaño de la pantalla
    expect(calendarGrid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
    
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    
    expect(calendarGrid.style.gridTemplateColumns).toBe('repeat(5, 1fr)');
    
    window.innerWidth = 480;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    
    expect(calendarGrid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });

  it('debería tener el contenedor de las cajas de los días con borde y fondo adecuado', () => {
    const dayBoxes = fixture.nativeElement.querySelectorAll('.day-box');
    dayBoxes.forEach((dayBox: HTMLElement) => {
      expect(dayBox.style.border).toBe('1px solid #ddd');
      expect(dayBox.style.backgroundColor).toBe('var(--ion-background-color)');
    });
  });

  it('debería aplicar estilos de sombra en la tarjeta de consejo', () => {
    const adviceCard = fixture.nativeElement.querySelector('.advice-card');
    expect(adviceCard.style.boxShadow).toBe('0 4px 6px rgba(0, 0, 1.2, 0.5)');
  });

  it('debería ajustar el tamaño de la fuente en la caja de los días en pantallas pequeñas', () => {
    window.innerWidth = 480;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    const dayBoxes = fixture.nativeElement.querySelectorAll('.day-box span');
    dayBoxes.forEach((span: HTMLElement) => {
      expect(span.style.fontSize).toBe('0.8em');
    });
  });
  
});

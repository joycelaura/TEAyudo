import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioPage } from './calendario.page';  
import { async } from '@angular/core/testing' ;

describe('CalendarioPage', () => {
  let component: CalendarioPage;
  let fixture: ComponentFixture<CalendarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarioPage]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Se inicializan las propiedades del componente
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();  
  });

  // Puedes agregar más pruebas aquí según sea necesario
});

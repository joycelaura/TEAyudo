import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule // Importa el módulo de pruebas del enrutador
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Llama a ngOnInit y establece el estado inicial
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "home" route', () => {
    // Simular la navegación
    component.router.navigate(['home']).then(() => {
      expect(component.router.url).toBe('/home'); // Verifica que la URL sea la esperada
    });
  });

  it('should navigate to "profile" route', () => {
    // Simular la navegación
    component.router.navigate(['profile']).then(() => {
      expect(component.router.url).toBe('/profile'); // Verifica que la URL sea la esperada
    });
  });

  it('should navigate to "emociones" route', () => {
    // Simular la navegación
    component.router.navigate(['emociones']).then(() => {
      expect(component.router.url).toBe('/emociones'); // Verifica que la URL sea la esperada
    });
  });

  it('should navigate to "calendario" route', () => {
    // Simular la navegación
    component.router.navigate(['calendario']).then(() => {
      expect(component.router.url).toBe('/calendario'); // Verifica que la URL sea la esperada
    });
  });

  it('should navigate to "tema" route', () => {
    // Simular la navegación
    component.router.navigate(['tema']).then(() => {
      expect(component.router.url).toBe('/tema'); // Verifica que la URL sea la esperada
    });
  });
});

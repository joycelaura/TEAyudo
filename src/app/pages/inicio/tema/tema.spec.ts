import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaPage } from './tema.page';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

describe('TemaPage', () => {
  let component: TemaPage;
  let fixture: ComponentFixture<TemaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemaPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TemaPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Llama a ngOnInit y establece el estado inicial
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title "Temas"', () => {
    const titleElement: HTMLElement = fixture.debugElement.query(By.css('ion-title')).nativeElement;
    expect(titleElement.textContent).toContain('Temas');
  });

  it('should render the theme toggle component', () => {
    const themeToggle = fixture.debugElement.query(By.css('app-theme-toggle'));
    expect(themeToggle).toBeTruthy(); // Verifica que el componente de cambio de tema esté presente
  });
});

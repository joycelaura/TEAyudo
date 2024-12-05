import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmocionesPage } from './emociones.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ThemeService } from 'src/app/services/theme.service';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('EmocionesPage', () => {
  let component: EmocionesPage;
  let fixture: ComponentFixture<EmocionesPage>;
  let firestoreSvcSpy: jasmine.SpyObj<FirestoreService>;
  let authSpy: jasmine.SpyObj<AngularFireAuth>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const firestoreSpy = jasmine.createSpyObj('FirestoreService', ['saveEmotionCount', 'getEmotionCount']);
    authSpy = jasmine.createSpyObj('AngularFireAuth', ['authState']);
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getCurrentTheme']);

    await TestBed.configureTestingModule({
      declarations: [EmocionesPage],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        { provide: FirestoreService, useValue: firestoreSpy },
        { provide: AngularFireAuth, useValue: authSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmocionesPage);
    component = fixture.componentInstance;
    firestoreSvcSpy = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;

    // Asegúrate de que se llamen las funciones necesarias para inicializar el componente
    fixture.detectChanges(); // Esto llama a ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title "Emociones"', () => {
    const titleElement: HTMLElement = fixture.debugElement.query(By.css('ion-title')).nativeElement;
    expect(titleElement.textContent).toContain('Emociones');
  });

  it('should call onEmotionClick with "ira" when the "Ira" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const iraButton = fixture.debugElement.query(By.css('.ira-button'));
    iraButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('ira');
  });
  
  it('should call onEmotionClick with "alegria" when the "Alegría" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const alegriaButton = fixture.debugElement.query(By.css('.alegria-button'));
    alegriaButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('alegria');
  });
  
  it('should call onEmotionClick with "tristeza" when the "Tristeza" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const tristezaButton = fixture.debugElement.query(By.css('.tristeza-button'));
    tristezaButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('tristeza');
  });
  
  it('should call onEmotionClick with "miedo" when the "Miedo" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const miedoButton = fixture.debugElement.query(By.css('.miedo-button'));
    miedoButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('miedo');
  });
  
  it('should call onEmotionClick with "agrado" when the "Agrado" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const agradoButton = fixture.debugElement.query(By.css('.agrado-button'));
    agradoButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('agrado');
  });
  
  it('should call onEmotionClick with "verguenza" when the "Vergüenza" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const verguenzaButton = fixture.debugElement.query(By.css('.verguenza-button'));
    verguenzaButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('verguenza');
  });
  
  it('should call onEmotionClick with "contencion" when the "Necesito Contención" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const contencionButton = fixture.debugElement.query(By.css('.contencion-button'));
    contencionButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('contencion');
  });
  
  it('should call onEmotionClick with "soledad" when the "Quiero estar solo" button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const soledadButton = fixture.debugElement.query(By.css('.soledad-button'));
    soledadButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('soledad');
  });
  

});


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

  it('should call onEmotionClick with "anger" when the anger button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const angerButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(1)'));
    angerButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('anger');
  });

  it('should call onEmotionClick with "joy" when the joy button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const joyButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(2)'));
    joyButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('joy');
  });

  it('should call onEmotionClick with "sadness" when the sadness button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const sadButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(3)'));
    sadButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('sadness');
  });

  it('should call onEmotionClick with "fear" when the fear button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const fearButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(4)'));
    fearButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('fear');
  });

  it('should call onEmotionClick with "shame" when the shame button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const shameButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(5)'));
    shameButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('shame');
  });

  it('should call onEmotionClick with "healing" when the healing button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const healingButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(6)'));
    healingButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('healing');
  });

  it('should call onEmotionClick with "alone" when the alone button is clicked', () => {
    spyOn(component, 'onEmotionClick');
    const aloneButton = fixture.debugElement.query(By.css('ion-button[expand="block"]:nth-child(7)'));
    aloneButton.triggerEventHandler('click', null);
    expect(component.onEmotionClick).toHaveBeenCalledWith('alone');
  });
});


import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { ThemeService } from './services/theme.service';
import { AudioService } from './services/audio.service';

describe("AppComponent", () => {
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let audioServiceSpy: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    // Crear espías (spies) para los servicios ThemeService y AudioService
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['loadTheme']);
    audioServiceSpy = jasmine.createSpyObj('AudioService', ['loadSound']);
    
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: AudioService, useValue: audioServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load theme on initialization', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Ejecutar ngOnInit
    await app.ngOnInit();

    // Verificar que se haya llamado al método loadTheme del ThemeService
    expect(themeServiceSpy.loadTheme).toHaveBeenCalled();
  });

  it('should load sounds on initialization', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Ejecutar ngOnInit
    await app.ngOnInit();

    // Verificar que se haya llamado al método loadSound del AudioService para cada sonido
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('alegria', 'assets/sounds/alegria.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('tristeza', 'assets/sounds/tristeza.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('ira', 'assets/sounds/ira.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('agrado', 'assets/sounds/agrado.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('contencion', 'assets/sounds/contencion.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('soledad', 'assets/sounds/soledad.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('miedo', 'assets/sounds/miedo.mp3');
    expect(audioServiceSpy.loadSound).toHaveBeenCalledWith('verguenza', 'assets/sounds/verguenza.mp3');
  });
});

import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

// Mock de AudioContext y AudioBuffer
class MockAudioContext {
  createBufferSource() {
    return {
      buffer: null,
      connect: jasmine.createSpy('connect'),
      start: jasmine.createSpy('start'),
    };
  }
  decodeAudioData() {
    return Promise.resolve({});
  }
}

// Mock de Response que simula el comportamiento de fetch
class MockResponse {
  constructor(private body: ArrayBuffer) {}

  arrayBuffer() {
    return Promise.resolve(this.body);
  }

  // Aquí agregamos las propiedades necesarias para que sea compatible con Response
  get headers() {
    return {
      get: () => null,
    };
  }
  get status() {
    return 200;
  }
  get ok() {
    return true;
  }
  get redirected() {
    return false;
  }
  get type() {
    return 'basic';
  }
  get url() {
    return '';
  }
  get clone() {
    return this;
  }
}

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    // Configurar el TestBed para el servicio
    TestBed.configureTestingModule({
      providers: [
        AudioService,
        { provide: AudioContext, useClass: MockAudioContext },  // Usamos el mock para AudioContext
        { provide: 'fetch', useValue: (url: string) => new MockResponse(new ArrayBuffer(8)) }, // Mockeamos fetch
      ],
    });
    service = TestBed.inject(AudioService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy(); // Aseguramos que el servicio se cree correctamente
  });

  it('should load sound successfully', async () => {
    spyOn(service, 'loadSound').and.callThrough(); // Espiamos la función loadSound

    await service.loadSound('testSound', 'testFilePath'); // Llamamos al método
    expect(service['audioBuffers']['testSound']).toBeDefined(); // Verificamos que el buffer de sonido esté cargado
    expect(service.loadSound).toHaveBeenCalledWith('testSound', 'testFilePath'); // Verificamos que se haya llamado con los parámetros correctos
  });

  
  it('should warn if sound is not loaded when playing', () => {
    const consoleWarnSpy = spyOn(console, 'warn'); // Espiamos la consola para verificar si se muestra la advertencia
    service.playSound('nonExistentSound'); // Intentamos reproducir un sonido no cargado
    expect(consoleWarnSpy).toHaveBeenCalledWith('El sonido nonExistentSound no está cargado.'); // Verificamos que se haya mostrado la advertencia
  });

  // Prueba de integración
  it('should handle the complete flow of loading and playing a sound', async () => {
    const loadSpy = spyOn(service, 'loadSound').and.callThrough(); // Espiamos el método loadSound
    const playSpy = spyOn(service, 'playSound').and.callThrough(); // Espiamos el método playSound
  
    // Simulamos la carga del sonido
    await service.loadSound('testSound', 'testFilePath');
  
    expect(loadSpy).toHaveBeenCalledWith('testSound', 'testFilePath'); // Verificamos que loadSound fue llamado con los parámetros correctos
  
    // Reproducimos el sonido cargado
    service.playSound('testSound');
    
    // Verificamos que playSound fue llamado con el nombre del sonido
    expect(playSpy).toHaveBeenCalledWith('testSound');
    
    // Simulamos que el sonido se ha reproducido correctamente
    const audioContext: MockAudioContext = new MockAudioContext();
    expect(audioContext.createBufferSource).toHaveBeenCalled(); // Verificamos que se haya creado un buffer para el sonido
    expect(audioContext.createBufferSource().start).toHaveBeenCalled(); // Verificamos que se haya iniciado la reproducción del sonido
  });
  
});

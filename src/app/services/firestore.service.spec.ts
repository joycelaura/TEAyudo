import { FirestoreService } from './firestore.service';
import { User } from 'src/app/models/user.model';
import { UserCredential, User as FirebaseUser } from 'firebase/auth'; // Importa los tipos necesarios

describe('FirestoreService', () => {
  let service: FirestoreService;

  beforeEach(() => {
    service = new FirestoreService(); // Inicia el servicio directamente
  });

  it('should sign in user and save email to localStorage', async () => {
    // Creamos un objeto User con las propiedades necesarias
    const user: User = {
      uid: 'mock-uid',
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'password123', // Asumimos que se necesita la contraseña también
      telefono: 123456789
    };

    // Creamos un "mock" del objeto Firebase User con solo las propiedades necesarias
    const mockFirebaseUser: Partial<FirebaseUser> = {
      uid: user.uid,
      email: user.email,
      emailVerified: true,  // Propiedad adicional de Firebase
      isAnonymous: false,  // Propiedad adicional de Firebase
      metadata: { creationTime: 'time', lastSignInTime: 'time' },  // Propiedad adicional de Firebase
      providerData: [],  // Propiedad adicional de Firebase
      phoneNumber: undefined,
      displayName: user.nombre,
      photoURL: null,
      providerId: 'firebase',
      refreshToken: 'some-refresh-token',
    };

    // Creamos un UserCredential simulado
    const mockUserCredential: UserCredential = {
      user: mockFirebaseUser as FirebaseUser, // Pasamos el objeto de Firebase User simulado
      providerId: 'firebase',
      operationType: 'signIn',
    };

    // Simulamos la llamada a signIn dentro de FirestoreService
    spyOn(service, 'signIn').and.returnValue(Promise.resolve(mockUserCredential));

    // Llamamos al método de inicio de sesión (signIn) del servicio
    await service.signIn(user);

    // Verificamos que el email se haya guardado correctamente en localStorage
    expect(localStorage.getItem('userEmail')).toBe('test@example.com');
  });

  it('should handle sign-in errors gracefully', async () => {
    // Simulamos un error al intentar iniciar sesión
    spyOn(service, 'signIn').and.returnValue(Promise.reject('Error de inicio de sesión'));

    try {
      await service.signIn({} as User);
    } catch (error) {
      expect(error).toBe('Error de inicio de sesión');
    }
  });

  // Otras pruebas adicionales, si es necesario
});

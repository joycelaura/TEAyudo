import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroPage } from './registro.page';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    firestoreServiceSpy = jasmine.createSpyObj('FirestoreService', ['emailExists', 'signUp']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the registration page component', () => {
    expect(component).toBeTruthy();
  });

  it('should require all fields', () => {
    const nombreControl = component.registerForm.controls['nombre'];
    const emailControl = component.registerForm.controls['correo'];
    const passwordControl = component.registerForm.controls['contrasena'];
    const confirmarContrasenaControl = component.registerForm.controls['confirmar_contrasena'];
    const telefonoControl = component.registerForm.controls['telefono'];

    nombreControl.setValue('');
    emailControl.setValue('');
    passwordControl.setValue('');
    confirmarContrasenaControl.setValue('');
    telefonoControl.setValue('');

    expect(nombreControl.valid).toBeFalsy();
    expect(emailControl.valid).toBeFalsy();
    expect(passwordControl.valid).toBeFalsy();
    expect(confirmarContrasenaControl.valid).toBeFalsy();
    expect(telefonoControl.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.controls['correo'];
    emailControl.setValue('invalidEmail');

    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('email')).toBeTruthy();
  });

  it('should validate password length', () => {
    const passwordControl = component.registerForm.controls['contrasena'];
    passwordControl.setValue('short');

    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('minlength')).toBeTruthy();
  });

  it('should display warning if passwords do not match', async () => {
    component.registerForm.controls['contrasena'].setValue('password123');
    component.registerForm.controls['confirmar_contrasena'].setValue('differentPassword');

    await component.validarFormulario();

    expect(toastControllerSpy.create).toHaveBeenCalled();
    expect(toastControllerSpy.create.calls.mostRecent().args[0].message).toBe('Las contraseñas no coinciden.');
  });

  it('should call emailExists and signUp if form is valid', async () => {
    // Simulamos que el email no existe
    firestoreServiceSpy.emailExists.and.returnValue(Promise.resolve(false));
    
    component.registerForm.controls['nombre'].setValue('Test User');
    component.registerForm.controls['correo'].setValue('test@example.com');
    component.registerForm.controls['contrasena'].setValue('validPassword123');
    component.registerForm.controls['confirmar_contrasena'].setValue('validPassword123');
    component.registerForm.controls['telefono'].setValue('1234567890');

    await component.validarFormulario();

    expect(firestoreServiceSpy.emailExists).toHaveBeenCalledWith('test@example.com');
    expect(firestoreServiceSpy.signUp).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

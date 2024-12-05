import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { of } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let firestoreSvcSpy: jasmine.SpyObj<FirestoreService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    firestoreSvcSpy = jasmine.createSpyObj('FirestoreService', ['emailExists', 'signUp']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: FirestoreService, useValue: firestoreSvcSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      nombre: null,
      correo: null,
      contrasena: null,
      confirmar_contrasena: null,
      telefono: null
    });
  });

  it('should invalidate the form when fields are empty', () => {
    component.registerForm.controls['nombre'].setValue('');
    component.registerForm.controls['correo'].setValue('');
    component.registerForm.controls['contrasena'].setValue('');
    component.registerForm.controls['confirmar_contrasena'].setValue('');
    component.registerForm.controls['telefono'].setValue('');

    expect(component.registerForm.invalid).toBeTruthy();
  });

  it('should show a warning when password fields do not match', async () => {
    component.registerForm.controls['contrasena'].setValue('password123');
    component.registerForm.controls['confirmar_contrasena'].setValue('password456');

    await component.validarFormulario();
    
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Las contraseñas no coinciden.' })
    );
  });

  it('should call emailExists and show warning if email is already in use', async () => {
    firestoreSvcSpy.emailExists.and.returnValue(Promise.resolve(true));

    component.registerForm.controls['correo'].setValue('test@example.com');
    component.registerForm.controls['contrasena'].setValue('password123');
    component.registerForm.controls['confirmar_contrasena'].setValue('password123');
    component.registerForm.controls['telefono'].setValue('1234567890');

    await component.validarFormulario();

    expect(firestoreSvcSpy.emailExists).toHaveBeenCalledWith('test@example.com');
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Este email ya está en uso!' })
    );
  });

  it('should call signUp and navigate on successful registration', async () => {
    firestoreSvcSpy.emailExists.and.returnValue(Promise.resolve(false));
    // Código en registro.spec.ts
    firestoreSvcSpy.signUp.and.returnValue(Promise.resolve());  // Cambiado a Promise.resolve() sin el objeto vacío


    component.registerForm.controls['nombre'].setValue('Juan');
    component.registerForm.controls['correo'].setValue('juan@example.com');
    component.registerForm.controls['contrasena'].setValue('password123');
    component.registerForm.controls['confirmar_contrasena'].setValue('password123');
    component.registerForm.controls['telefono'].setValue('1234567890');

    await component.validarFormulario();

    expect(firestoreSvcSpy.signUp).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: '¡Cuenta Registrada con Éxito! :)' })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show a warning if form is invalid', async () => {
    component.registerForm.controls['nombre'].setValue('');
    await component.validarFormulario();

    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Por favor, complete todos los campos correctamente.' })
    );
  });

  it('should toggle password visibility', () => {
    expect(component.mostrarContrasena).toBeFalse();
    component.toggleMostrarContrasena();
    expect(component.mostrarContrasena).toBeTrue();
  });
});

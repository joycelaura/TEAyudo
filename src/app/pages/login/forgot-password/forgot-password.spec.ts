import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordPage } from './forgot-password.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

// Mocks
class FirestoreServiceMock {
  sendRecoveryEmail = jasmine.createSpy('sendRecoveryEmail').and.returnValue(Promise.resolve());
}

class UtilsServiceMock {
  loading = jasmine.createSpy('loading').and.returnValue({
    present: jasmine.createSpy('present'),
    dismiss: jasmine.createSpy('dismiss'),
  });

  presentToast = jasmine.createSpy('presentToast');
  routerLink = jasmine.createSpy('routerLink');
}

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  let firestoreServiceMock: FirestoreServiceMock;
  let utilsServiceMock: UtilsServiceMock;

  beforeEach(async () => {
    firestoreServiceMock = new FirestoreServiceMock();
    utilsServiceMock = new UtilsServiceMock();

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordPage],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Forgot Password component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('¿Olvidaste tu contraseña?');
  });

  it('should disable the submit button when form is invalid', () => {
    component.form.controls['email'].setValue('');
    expect(component.form.invalid).toBeTrue();
    expect(fixture.nativeElement.querySelector('ion-button').disabled).toBeTrue();
  });

  it('should enable the submit button when form is valid', () => {
    component.form.controls['email'].setValue('test@example.com');
    expect(component.form.valid).toBeTrue();
    expect(fixture.nativeElement.querySelector('ion-button').disabled).toBeFalse();
  });

  it('should show required error when email is empty and touched', () => {
    const emailControl = component.form.controls['email'];
    emailControl.setValue('');
    emailControl.markAsTouched();
    expect(emailControl.errors?.['required']).toBeTrue();
  });

  it('should show invalid email error when email is not valid and touched', () => {
    const emailControl = component.form.controls['email'];
    emailControl.setValue('invalidEmail');
    emailControl.markAsTouched();
    expect(emailControl.errors?.['email']).toBeTrue();
  });

  it('should call sendRecoveryEmail and show toast on submit if form is valid', async () => {
    component.form.controls['email'].setValue('test@example.com');
    await component.submit();
    
    expect(firestoreServiceMock.sendRecoveryEmail).toHaveBeenCalledWith('test@example.com');
    expect(utilsServiceMock.presentToast).toHaveBeenCalledWith({
      message: "correo enviado con exito",
      duration: 1500,
      color: "primary",
      position: "middle",
      icon: "mail-outline",
    });
    expect(utilsServiceMock.routerLink).toHaveBeenCalledWith("/auth");
    expect(component.form.value.email).toBe('');
  });

  it('should handle error in sendRecoveryEmail and show toast on failure', async () => {
    const errorMessage = "Error en el envío del correo";
    firestoreServiceMock.sendRecoveryEmail.and.returnValue(Promise.reject({ message: errorMessage }));

    component.form.controls['email'].setValue('test@example.com');
    await component.submit();

    expect(utilsServiceMock.presentToast).toHaveBeenCalledWith({
      message: errorMessage,
      duration: 2500,
      color: "primary",
      position: "middle",
      icon: "alert-circle-outline",
    });
  });
});

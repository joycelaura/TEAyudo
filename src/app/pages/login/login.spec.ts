import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model'; 
import { UserCredential } from 'firebase/auth'; 

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let firestoreSvc: jasmine.SpyObj<FirestoreService>;
  let utilsSvc: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    const firestoreSpy = jasmine.createSpyObj('FirestoreService', ['signIn', 'getDocument']);
    const utilsSpy = jasmine.createSpyObj('UtilsService', ['loading', 'presentToast', 'saveInLocalStorage', 'routerLink']);
    
    const loadingElement = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
    };

    utilsSpy.loading.and.returnValue(Promise.resolve(loadingElement));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FirestoreService, useValue: firestoreSpy },
        { provide: UtilsService, useValue: utilsSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    firestoreSvc = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;
    utilsSvc = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
    fixture.detectChanges();
  });

  it('should create the login page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a required email field', () => {
    const emailControl = component.form.controls['email'];
    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('required')).toBeTruthy();
  });

  it('should validate email pattern', () => {
    const emailControl = component.form.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('email')).toBeTruthy();
  });

  it('should have a required password field', () => {
    const passwordControl = component.form.controls['password'];
    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('required')).toBeTruthy();
  });

  it('should call submit when form is valid', async () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password123');

    await component.submit();

    expect(utilsSvc.loading).toHaveBeenCalled();
    expect(firestoreSvc.signIn).toHaveBeenCalledWith({
      email: component.form.value.email,
      password: component.form.value.password,
    } as User);
  });

  it('should handle sign in error', async () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password123');
    
    firestoreSvc.signIn.and.returnValue(Promise.reject({ message: 'Login failed' }));

    await component.submit();

    expect(utilsSvc.presentToast).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Login failed',
    }));
  });

  it('should reset form after successful login', async () => {
    const mockUser = {
      uid: '123',
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      telefono: '1234567890',
      emailVerified: false,
      isAnonymous: false,
      metadata: {},          
      providerData: [],
    };
    
    const mockUserCredential: UserCredential = {
      user: mockUser as any,
      providerId: 'password',
      operationType: 'signIn',
    } as UserCredential;

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password123');

    firestoreSvc.signIn.and.returnValue(Promise.resolve(mockUserCredential));
    firestoreSvc.getDocument.and.returnValue(Promise.resolve(mockUser));

    await component.submit();

    expect(utilsSvc.saveInLocalStorage).toHaveBeenCalledWith('user', mockUser);
    expect(component.form.valid).toBeFalsy(); // El formulario debe resetearse
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'firebase/auth';
import { IonInput } from '@ionic/angular';
import { Component } from '@angular/core';

// Mocks
@Component({
  selector: 'ion-input',
  template: ''
})
class IonInputMock {}

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const firestoreServiceMock = jasmine.createSpyObj('FirestoreService', ['signOut']);
    const firestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProfilePage, IonInputMock],
      providers: [
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;

    // Mock user data
    const mockUser = { uid: 'testUid' } as User;
    firestoreServiceMock.auth = {
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        callback(mockUser);
      }
    };

    const userData = { nombre: 'Test User', password: 'TestPassword123', email: 'test@example.com' };
    firestoreMock.collection.and.returnValue({
      doc: () => ({
        get: () => of({ data: () => userData }),
      }),
    });

    fixture.detectChanges();
  });

  it('should create the profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data on ngOnInit', () => {
    component.ngOnInit();
    expect(component.nombre).toEqual('Test User');
    expect(component.password).toEqual('TestPassword123');
    expect(component.correo).toEqual('test@example.com');
  });

  it('should toggle edit mode', () => {
    component.toggleEdit();
    expect(component.isEditable).toBeTrue();
    component.toggleEdit();
    expect(component.isEditable).toBeFalse();
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should call signOut when logout is executed', async () => {
    await component.signOut();
    expect(firestoreServiceSpy.signOut).toHaveBeenCalled();
  });
});


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { async } from '@angular/core/testing' ;

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a button to navigate to Emociones page', () => {
    const button = fixture.debugElement.query(By.css('ion-button[href="inicio/emociones"]'));
    expect(button).toBeTruthy();
  });

  it('should contain a button to navigate to Calendario page', () => {
    const button = fixture.debugElement.query(By.css('ion-button[href="inicio/calendario"]'));
    expect(button).toBeTruthy();
  });
});

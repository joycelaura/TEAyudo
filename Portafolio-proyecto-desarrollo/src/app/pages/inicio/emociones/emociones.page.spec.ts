import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmocionesPage } from './emociones.page';

describe('EmocionesPage', () => {
  let component: EmocionesPage;
  let fixture: ComponentFixture<EmocionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

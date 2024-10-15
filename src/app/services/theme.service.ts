import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;

  private currentTheme = 'default';

  constructor() {
    this.loadTheme();
  }

  /*
  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.saveTheme();
  }*/

  setTheme(theme: string) {
    this.currentTheme = theme;
    this.applyTheme();
    this.saveTheme();
  }

  /*
  applyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
  */

  applyTheme() {
    console.log(`Applying theme: ${this.currentTheme}`);
    document.body.classList.remove('default-theme', 'dark-theme', 'light-theme', 'amarillo-theme', 'pastel-theme', 'rojo-theme', 'azul-theme', 'verde-theme', 'morado-theme', 'rosa-theme' );
    document.body.classList.add(`${this.currentTheme}-theme`);
    //document.documentElement.style.setProperty('--background', `var(--theme-${this.currentTheme}-background)`);
  }

  saveTheme() {
    localStorage.setItem('currentTheme', this.currentTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('currentTheme');
    this.currentTheme = savedTheme ? savedTheme : 'default';
    this.applyTheme();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

}

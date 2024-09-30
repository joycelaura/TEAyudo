import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = false;

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.saveTheme();
  }

  applyTheme() {
    if (this.isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  saveTheme() {
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('isDark');
    this.isDark = savedTheme ? JSON.parse(savedTheme) : false;
    this.applyTheme();
  }

  getCurrentTheme() {
    return this.isDark ? 'dark' : 'light';
  }
}

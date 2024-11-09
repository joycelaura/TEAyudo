import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { async } from '@angular/core/testing' ;

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should apply the specified theme', () => {
    const theme = 'dark';
    service.setTheme(theme);
    expect(service.getCurrentTheme()).toBe(theme);
    expect(document.body.classList.contains(`${theme}-theme`)).toBeTrue();
  });
});

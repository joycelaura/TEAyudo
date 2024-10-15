import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-tema',
  templateUrl: './tema.page.html',
  styleUrls: ['./tema.page.scss'],
})
export class TemaPage implements OnInit {

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
  }

  //TODO: ESTO NO VA DE MOMENTO
  getBackgroundColor() {
    return `var(--theme-${this.themeService.getCurrentTheme()}-background)`;
  }

}

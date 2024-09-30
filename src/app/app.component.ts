import { Component } from "@angular/core";
import { ThemeService } from './services/theme.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    // Cargar el tema al iniciar la aplicación
    this.themeService.loadTheme();
  }
}

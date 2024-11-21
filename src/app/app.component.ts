import { Component, OnInit } from '@angular/core';"@angular/core";
import { ThemeService } from './services/theme.service';
import { AudioService } from "./services/audio.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {	
  constructor(private themeService: ThemeService, private audioService: AudioService) {
    // Cargar el tema al iniciar la aplicación
    this.themeService.loadTheme();
  }

  async ngOnInit() {
    await this.audioService.loadSound('alegria', 'assets/sounds/alegria.mp3');
    await this.audioService.loadSound('tristeza', 'assets/sounds/tristeza.mp3');
    await this.audioService.loadSound('ira', 'assets/sounds/ira.mp3');
    await this.audioService.loadSound('agrado', 'assets/sounds/agrado.mp3');
    await this.audioService.loadSound('contencion', 'assets/sounds/contencion.mp3');
    await this.audioService.loadSound('soledad', 'assets/sounds/soledad.mp3');
    await this.audioService.loadSound('miedo', 'assets/sounds/miedo.mp3');
    await this.audioService.loadSound('verguenza', 'assets/sounds/verguenza.mp3');
  }
}

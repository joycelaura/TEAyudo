import { Component, OnInit, inject } from "@angular/core";
import { ThemeService } from "src/app/services/theme.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.applyStoredTheme();
  }

  async applyStoredTheme() {
    const currentTheme = this.themeService.getCurrentTheme();
    document.body.classList.add(currentTheme);
  }
}
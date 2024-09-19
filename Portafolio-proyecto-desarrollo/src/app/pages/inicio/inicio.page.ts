import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.page.html",
  styleUrls: ["./inicio.page.scss"],
})
export class InicioPage implements OnInit {
  router = inject(Router);
  currentPath: string = "";

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

}

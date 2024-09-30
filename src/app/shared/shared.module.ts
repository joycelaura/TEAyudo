import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { CustomInputComponent } from "./component/custom-input/custom-input.component";
import { LogoComponent } from "./component/logo/logo.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TabsComponent } from "./component/tabs/tabs.component";

import { RouterModule } from "@angular/router";
import { ThemeToggleComponent } from "./component/theme/theme-toggle/theme-toggle.component";

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    TabsComponent,
    ThemeToggleComponent,
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    TabsComponent,
    ThemeToggleComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class SharedModule {}
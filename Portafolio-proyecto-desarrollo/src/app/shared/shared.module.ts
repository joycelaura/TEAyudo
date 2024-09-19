import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { CustomInputComponent } from "./component/custom-input/custom-input.component";
import { LogoComponent } from "./component/logo/logo.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TabsComponent } from "./component/tabs/tabs.component";

import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    TabsComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    TabsComponent
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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
import { Observable } from "rxjs";
import {HttpParams} from "@angular/common/http";

import { AppComponent } from './app.component';
import { HeaderLayoutComponent } from './header-layout/header-layout.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ComandosComponent } from './comandos/comandos.component';
import { BodyComponent } from './body/body.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderLayoutComponent,
    UsuariosComponent,
    ComandosComponent,
    BodyComponent,
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

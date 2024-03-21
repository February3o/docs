import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShaderModule } from './shader/shader.module';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ShaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

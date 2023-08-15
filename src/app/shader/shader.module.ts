import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { ShaderRoutingModule } from './shader-routing.module';
import { StarComponent } from './star/star.component';
import { ShaderComponent } from './shader.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CubeComponent } from './cube/cube.component';
import { ThreeService } from '../service/three.service';


@NgModule({
  declarations: [
    StarComponent,
    ShaderComponent,
    CubeComponent,
  ],
  imports: [
    CommonModule,
    ShaderRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
  exports: [
    StarComponent
  ],
  providers: [
    ThreeService
  ]
})
export class ShaderModule { }

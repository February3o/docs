import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShaderRoutingModule } from './shader-routing.module';
import { StarComponent } from './star/star.component';


@NgModule({
  declarations: [
    StarComponent
  ],
  imports: [
    CommonModule,
    ShaderRoutingModule
  ],
  exports: [
    StarComponent
  ]
})
export class ShaderModule { }

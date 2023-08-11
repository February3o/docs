import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShaderComponent } from './shader.component';
import { StarComponent } from './star/star.component';
const routes: Routes = [
  // {
  //   path: '', redirectTo: '/', pathMatch: 'full',
  // },
  {
    path: '',
    component: ShaderComponent,
    children: [
      {
        path: "star",
        component: StarComponent
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShaderRoutingModule { }

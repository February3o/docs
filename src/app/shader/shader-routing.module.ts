import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StarComponent } from './star/star.component';
const routes: Routes = [
  { path: '', redirectTo: 'star', pathMatch: 'full' },
  {
    path: "star",
    component: StarComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShaderRoutingModule { }

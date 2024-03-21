import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    path: 'index',
    component: HomeComponent,
  },
  {
    path: 'shader',
    loadChildren: () => import("./shader/shader.module").then((mod) => mod.ShaderModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

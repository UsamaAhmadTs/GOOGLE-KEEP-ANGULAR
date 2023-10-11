import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {ArchiveComponent} from "./components/archive/archive.component";

import {InputComponent} from "./components/input/input.component";
import {SearchComponent} from "./components/search/search.component";

const routes: Routes = [
  {path: 'notes', component: InputComponent},
  {path: 'archived', component: ArchiveComponent},
  {path: 'search', component: SearchComponent},
  {path: '', component: InputComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

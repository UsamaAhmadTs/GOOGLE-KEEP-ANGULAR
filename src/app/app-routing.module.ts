import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {ArchiveComponent} from "./components/archive/archive.component";

import {NoteInputComponent} from "./components/noteInput/note-input.component";
import {SearchComponent} from "./components/search/search.component";

const routes: Routes = [
  {path: 'notes', component: NoteInputComponent},
  {path: 'archived', component: ArchiveComponent},
  {path: 'search', component: SearchComponent},
  {path: '', component: NoteInputComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

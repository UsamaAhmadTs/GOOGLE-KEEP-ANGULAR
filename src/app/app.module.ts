import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {MainComponent} from './components/main/main.component';

import {NavbarComponent} from './components/navbar/navbar.component';

import {SidenavComponent} from './components/sidenav/sidenav.component';

import {InputComponent} from './components/input/input.component';

import {NotesComponent} from './components/notes/notes.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {ArchiveComponent} from './components/archive/archive.component';
import { SearchComponent } from './components/search/search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { EditModalComponent } from './components/modal/edit-modal.component';
import { NoteTemplateComponent } from './components/note-template/note-template.component';
import { LabelComponent } from './components/label/label.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SidenavComponent,
    InputComponent,
    NotesComponent,
    ArchiveComponent,
    SearchComponent,
    EditModalComponent,
    NoteTemplateComponent,
    LabelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {MainComponent} from './components/main/main.component';

import {NavbarComponent} from './components/navbar/navbar.component';

import {SidenavComponent} from './components/sidenav/sidenav.component';

import {InputComponent} from './components/input/input.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NotesComponent } from './components/notes/notes.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SidenavComponent,
    InputComponent,
    NotesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

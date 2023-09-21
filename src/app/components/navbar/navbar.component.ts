import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild("form") form?: ElementRef<HTMLDivElement>

  searchQuery: string = '';

  filteredNotes: Note[] = [];

  constructor(private noteService: NotesService, private router: Router) {
  }

  isArchiveRoute(): boolean {
    return this.router.url === '/archived';
  }

  onSearchInputChange() {
    this.noteService.setSearchQuery(this.searchQuery)
    this.router.navigate(['/search']);
  }

  refresh() {
    window.location.reload()
  }

}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild("form") form?: ElementRef<HTMLDivElement>

  searchQuery: string = '';

  private filteredNotes: Note[] = [];

  constructor(private noteService: NotesService) {
  }

  onSearchInputChange() {
    this.noteService.getFilteredNotes(this.searchQuery);
  }

  refresh() {
    window.location.reload()
  }

  ngOnInit(): void {
    this.noteService.searchQuery$.subscribe((query) => {
      this.filteredNotes = this.noteService.getFilteredNotes(query);
    });
  }

}

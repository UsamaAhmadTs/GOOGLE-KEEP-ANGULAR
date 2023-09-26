import {ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {map, Observable} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchComponent implements OnInit {

  filteredNotes: Note[] | null = null;
  searchQuery$: Observable<string | null>;
  highlightedSearchQuery: string | null = null;
  showMixedNotes: boolean = false;

  constructor(private noteService: NotesService) {
    this.searchQuery$ = this.noteService.searchQuery$;
  }

  checkAndSetMixedNotesStatus(): void {
    const hasMixed = this.filteredNotes?.some(note => note.isArchived)
      && this.filteredNotes.some(note => !note.isArchived);
    if (hasMixed) {
      this.showMixedNotes = true;
    }
  }

  ngOnInit(): void {
    this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filteredNotes = filteredNotes.reverse();
      this.checkAndSetMixedNotesStatus();
    });
    this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });
  }

}

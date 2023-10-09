import {Component, OnInit} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  filteredNotes$: Observable<Note[]>;
  searchQuery$: Observable<string | null>;
  notes: Note[] = [];
  private searchSubscription!: Subscription;
  constructor(private noteService: NotesService) {
    this.searchQuery$ = this.noteService.searchQuery$;
    this.filteredNotes$ = this.noteService.filteredNotes$;
  }

  ngOnInit(): void {
    this.searchSubscription = this.filteredNotes$.subscribe((filteredNotes) => {
      this.notes = filteredNotes;
    });
  }

  isMixedNotes(): boolean {
    return this.noteService.isMixedNotes();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}


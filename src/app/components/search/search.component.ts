import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  filteredNotes$: Observable<Note[]>;
  searchQuery$: Observable<string | null>;
  notes: Note[] = [];
  private filteredNotesSubscription!: Subscription;

  constructor(private noteService: NotesService) {
    this.searchQuery$ = this.noteService.searchQuery$;
    this.filteredNotes$ = this.noteService.filteredNotes$;
  }

  ngOnInit(): void {
    this.filteredNotesSubscription = this.filteredNotes$.subscribe((filteredNotes) => {
      this.notes = filteredNotes;
    });
  }
  selectedNote!: Note ;
  isMixedNotes(): boolean {
    return this.noteService.isMixedNotes();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element.closest('.notec')) {
      this.noteService.close();
    }
  }

  ngOnDestroy() {
    if (this.filteredNotesSubscription) {
      this.filteredNotesSubscription.unsubscribe();
    }
  }
}


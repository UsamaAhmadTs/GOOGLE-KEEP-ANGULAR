import {ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {Observable} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchComponent implements OnInit {
  @ViewChild('noteElement') noteElement!: ElementRef;
  filteredNotes: Note[] | null = null;
  searchQuery$: Observable<string | null>;
  highlightedSearchQuery: string | null = null;
  showMixedNotes: boolean = false;
  selectedNote!: Note | null;


  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  onNoteSelected(note: Note) {
    this.selectedNote = note;
    note.display = true;
  }

  constructor(private noteService: NotesService, private renderer: Renderer2) {
    this.searchQuery$ = this.noteService.searchQuery$;
  }

  highlightMatches(text: string, query: string | null): string {
    if (query === null || query.trim() === '') return text;

    const regex = new RegExp(this.escapeRegExp(query), 'gi');
    return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
  }

  private escapeRegExp(query: string): string {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  ngOnInit(): void {

    this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filteredNotes = filteredNotes.reverse();
      this.showMixedNotes = false;
      const hasMixedArchivedStatus = this.filteredNotes.some(note => note.isArchived)
        && this.filteredNotes.some(note => !note.isArchived);
      if (hasMixedArchivedStatus) {
        this.showMixedNotes = true;
      }
    });
    this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });
  }

  archiveNote(note: Note) {
    note.isArchived = true;
    this.noteService.updateNote(note);
  }

  deleteNote(noteToDelete: Note) {
    this.noteService.deleteNotes(noteToDelete);
  }

  unArchiveNote(note: Note) {
    note.isArchived = false;
    this.noteService.updateNote(note);
    const hasArchived = this.filteredNotes!.some(note => note.isArchived);
    if (hasArchived) {
    }
  }

  addLabel(note: Note) {
  }
}

import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable, of} from "rxjs";

import {Label} from "../label";

@Component({
  selector: 'app-note-template',
  templateUrl: './note-template.component.html',
  styleUrls: ['./note-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NoteTemplateComponent implements OnInit {
  @Input() isArchiveNote: boolean = false;
  @Input() highLight: boolean = false;

  showMixedNotes: boolean = false;
  highlightedSearchQuery: string | null = null;
  notes$: Observable<Note[]> = this.noteService.notesSubject.asObservable();

  labels: Label[] = [];
  filteredNotes: Note[] | null = null;
  searchQuery$!: Observable<string | null>;
  labelTitle: string = '';

  constructor(private noteService: NotesService, private dialog: MatDialog) {
    this.searchQuery$ = this.noteService.searchQuery$;
    this.notes$ = this.noteService.getNotes();
    this.notes$.subscribe((notes) => {
      this.notes$ = new Observable((observer) => {
        observer.next(notes);
        observer.complete();
      });
    });
    this.noteService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
    this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filteredNotes = filteredNotes.reverse();
      this.showMixedNotes = false;
    });
  }

  ngOnInit() {
    this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });
  }

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }

  toggleLabelMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showLabelMenu = !note.showLabelMenu;
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  highlightMatches(text: string, query: string | null): string {
    if (query === null || query.trim() === '') return text;
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
  }

  onNoteSelected(note: Note) {
    this.noteService.setNoteDisplayToLocalStorage(note)
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: {note},
    });
  }

  deleteNote(noteToDelete: Note) {
    this.noteService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes$ = of(updatedNotes);
      }
    });
  }

  archiveNote(note: Note) {
    note.isArchived = !note.isArchived;
    this.noteService.archiveNotes(note).subscribe(updatedNotes => {
      this.notes$ = of(updatedNotes);
    });
  }

}

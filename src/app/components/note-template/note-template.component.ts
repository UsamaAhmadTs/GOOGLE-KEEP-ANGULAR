import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../../modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable} from "rxjs";

@Component({
  selector: 'app-note-template',
  templateUrl: './note-template.component.html',
  styleUrls: ['./note-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NoteTemplateComponent implements OnInit {
  @Output() selectedNoteChanged = new EventEmitter<Note | null>();
  @Input() isArchiveNote: boolean = false;
  @Input() highLight: boolean = false;

  highlightedSearchQuery: string | null = null;

  notes: Note[] = []
  filteredNotes: Note[] | null = null;
  searchQuery$!: Observable<string | null>;
  showMixedNotes: boolean = false;

  constructor(private noteService: NotesService, private dialog: MatDialog) {
    this.searchQuery$ = this.noteService.searchQuery$;
  }

  selectedNote!: Note | null;

  ngOnInit() {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

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

  highlightMatches(text: string, query: string | null): string {
    if (query === null || query.trim() === '') return text;

    const regex = new RegExp(this.escapeRegExp(query), 'gi');
    return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
  }

  private escapeRegExp(query: string): string {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  onNoteSelected(note: Note) {
    this.selectedNote = note;
    note.display = true;
    this.selectedNoteChanged.emit(note);
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: {note},
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  deleteNote(noteToDelete: Note) {
    this.noteService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes = updatedNotes;
      }
    });
  }

  archiveNote(note: Note) {
    note.isArchived = !note.isArchived;
    this.noteService.archiveNotes(note).subscribe(updatedNotes => {
      this.notes = updatedNotes;
      this.selectedNote = null;
    });
  }

  addLabel(note: Note) {
  }

}

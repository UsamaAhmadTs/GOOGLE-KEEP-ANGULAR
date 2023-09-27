import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable} from "rxjs";

@Component({
  selector: 'app-note-template',
  templateUrl: './note-template.component.html',
  styleUrls: ['./note-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NoteTemplateComponent implements OnInit {
  @Input() isArchiveNote: boolean = false;
  @Input() highLight: boolean = false;
  @ViewChild('labelMenuTt') labelMenu!: ElementRef;

  showMixedNotes: boolean = false;
  highlightedSearchQuery: string | null = null;
  labelMenuOpen: boolean = false;

  notes: Note[] = []
  filteredNotes: Note[] | null = null;
  searchQuery$!: Observable<string | null>;
  constructor(private noteService: NotesService, private dialog: MatDialog) {
    this.searchQuery$ = this.noteService.searchQuery$;
  }

  selectedNote!: Note | null;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.labelMenu.nativeElement.contains(event.target)) {
      this.labelMenuOpen = false;
    }
  }
  toggleLabelMenu( event: Event) {
    event.stopPropagation();
    this.labelMenuOpen = !this.labelMenuOpen;
  }
  ngOnInit() {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

    this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filteredNotes = filteredNotes.reverse();
      this.showMixedNotes = false;
    });
    this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });

  }

  highlightMatches(text: string, query: string | null): string {
    if (query === null || query.trim() === '') return text;
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
  }

  onNoteSelected(note: Note) {
    this.selectedNote = note;
    note.display = true;
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

}

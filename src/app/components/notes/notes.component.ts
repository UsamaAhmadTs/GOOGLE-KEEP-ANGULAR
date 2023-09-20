import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('noteElement') noteElement!: ElementRef;
  notes: Note[] = [];

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  selectedNote!: Note | null;

  onNoteSelected(note: Note) {
    this.selectedNote = note;
    note.display = true;
  }

  constructor(private notesService: NotesService) {
  }

  ngOnInit() {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

  deleteNote(noteToDelete: Note) {
    this.notesService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes = updatedNotes;
      }
    });
  }

  archiveNote(note: Note) {
    note.isArchived = true;
    this.notesService.archiveNotes(note).subscribe(updatedNotes => {
      this.notes = updatedNotes;
    });
  }

  updateNote(selectedNote: Note) {
    this.notesService.updateNote(selectedNote);
    selectedNote.display = false;
    this.selectedNote = null;
  }

  addLabel(noteToLabel: Note) {
  }

}

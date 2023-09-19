import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  archiveNotes: Note[] = [];

  ngOnInit() {
    this.notesService.getArchivedNotes().subscribe((notes) => {
      this.archiveNotes = notes;
    });
  }

  constructor(private notesService: NotesService) {
  }

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  toggleDropdownMenu(note: Note) {
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  deleteNote(noteToDelete: Note) {
    this.notesService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.archiveNotes = updatedNotes;
      }
    });
  }

  archiveNote(note: Note) {
    note.isArchived = false;
    this.notesService.archiveNotes(note).subscribe(updatedNotes => {
      this.archiveNotes = updatedNotes;
    });
  }

  addLabel(note: Note) {
  }
}

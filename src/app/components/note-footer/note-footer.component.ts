import {Component, Input} from '@angular/core';

import {Note} from "../note";

import {EditModalComponent} from "../modal/edit-modal.component";

import {NotesService} from "../notes-service";

import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-note-footer',
  templateUrl: './note-footer.component.html',
  styleUrls: ['./note-footer.component.scss']
})
export class NoteFooterComponent {
  @Input() note!: Note;
  constructor(private noteService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>) {
  }
  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }
  archiveNote(note: Note) {
    note.isArchived = !note.isArchived;
    this.noteService.archiveNotes(note).subscribe(updatedNotes => {
      this.dialogRef.close();
    });
  }
}


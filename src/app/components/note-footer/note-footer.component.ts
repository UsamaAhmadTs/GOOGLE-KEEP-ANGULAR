import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {Router} from "@angular/router";

@Component({
  selector: 'app-note-footer',
  templateUrl: './note-footer.component.html',
  styleUrls: ['./note-footer.component.scss']
})
export class NoteFooterComponent {
  @Input() note!: Note;
  @Output() archiveEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() createArchive = true;
  constructor(private noteService: NotesService, private router: Router) {
  }
  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }

  archiveNote(note: Note) {
    if (this.router.url === '/search'){
      note.isArchived = !note.isArchived;
      this.noteService.archiveSearchNotes(note).subscribe(updatedNotes => {
        this.archiveEvent.emit();
      });
    }
    else if (!note.isArchived){
      note.isArchived = !note.isArchived;
      this.noteService.archiveNotes(note).subscribe(updatedNotes => {
        this.archiveEvent.emit();
      });
    }else {
      note.isArchived = !note.isArchived;
      this.noteService.archiveNotesfromArchive(note).subscribe(updatedNotes => {
        this.archiveEvent.emit();
      });
    }
  }

}


import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Note} from "../note";

import {NoteTemplateComponent} from "../note-template/note-template.component";

@Component({
  selector: 'app-note-footer',
  templateUrl: './note-footer.component.html',
  styleUrls: ['./note-footer.component.scss']
})
export class NoteFooterComponent {
  @Input() note!: Note;
  @Output() archiveEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() createArchive = true;
  @Input() undoRedoButtons = true;
  constructor(private noteService: NoteTemplateComponent) {
  }

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }

  archiveNote(note: Note) {
  this.noteService.archiveNote(note);
    this.archiveEvent.emit();
  }

}

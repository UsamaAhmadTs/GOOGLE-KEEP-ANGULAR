import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {Subscription} from "rxjs";

@Component({
  selector: 'app-note-footer',
  templateUrl: './note-footer.component.html',
  styleUrls: ['./note-footer.component.scss']
})
export class NoteFooterComponent implements OnDestroy{
  @Input() note!: Note;
  @Output() archiveEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() createArchive = true;
  private archiveNotesSubscription!: Subscription;
  constructor(private noteService: NotesService) {
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
    this.archiveNotesSubscription = this.noteService.archiveNotes(note).subscribe(updatedNotes => {
      this.archiveEvent.emit();
    });
  }

  ngOnDestroy(): void {
    if (this.archiveNotesSubscription) {
      this.archiveNotesSubscription.unsubscribe();
    }
  }

}


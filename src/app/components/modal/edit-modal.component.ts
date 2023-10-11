import {Component, OnInit, Inject, Input, OnDestroy} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
  @Input() searchLabelText: string = '';
  notes: Note[] = []
  selectedNote!: Note;
  labelTitle: string = '';
  private getNotesSubscription: Subscription;
  private deleteNotesSubscription!: Subscription;
  private afterClosedSubscription!: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { note: Note },
              private notesService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>) {
    this.notesService.getNotes();
    this.getNotesSubscription = this.notesService.notesSubject.subscribe(notes => {
      this.notes = notes;
    });
  }

  ngOnInit() {
    this.selectedNote = this.data.note;
    this.afterClosedSubscription = this.dialogRef.afterClosed().subscribe(() => {
      this.updateNote(this.selectedNote);
      this.selectedNote.showDropdownMenu = false;
      this.selectedNote.showLabelMenu = false;
    });
    window.addEventListener('beforeunload', () => {
      this.dialogRef.close();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  toggleLabelMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showLabelMenu = !note.showLabelMenu;
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  deleteNote(noteToDelete: Note) {
    this.deleteNotesSubscription = this.notesService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes = updatedNotes;
        this.dialogRef.close();
      }
    });
  }

  updateNote(selectedNote: Note) {
    this.notesService.updateNote(selectedNote);
    this.dialogRef.close();
  }
  ngOnDestroy() {
    if (this.getNotesSubscription) {
      this.getNotesSubscription.unsubscribe();
    }
    if (this.deleteNotesSubscription) {
      this.deleteNotesSubscription.unsubscribe();
    }
    if (this.afterClosedSubscription) {
      this.afterClosedSubscription.unsubscribe();
    }
  }
}

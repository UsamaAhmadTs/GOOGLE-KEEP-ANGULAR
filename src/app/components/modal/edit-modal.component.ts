import {Component, OnInit, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
    notes: Note[] = []
    selectedNote!: Note;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { note: Note },
                private notesService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>) {
    }

    ngOnInit() {
        this.selectedNote = this.data.note;
        this.notesService.getNotes().subscribe((notes) => {
            this.notes = notes;
        });
        this.dialogRef.afterClosed().subscribe(() => {
            this.updateNote(this.selectedNote)
        });
    }

    toggleDropdownMenu(note: Note, event: Event) {
        event.stopPropagation();
        note.showDropdownMenu = !note.showDropdownMenu;
    }

    deleteNote(noteToDelete: Note) {
        this.notesService.deleteNotes(noteToDelete).subscribe({
            next: updatedNotes => {
                this.notes = updatedNotes;
            }
        });
    }

    archiveNote(note: Note) {
        note.isArchived = !note.isArchived;
        this.notesService.archiveNotes(note).subscribe(updatedNotes => {
            this.notes = updatedNotes;
        });
    }

    updateNote(selectedNote: Note) {
        this.notesService.updateNote(selectedNote);
        selectedNote.display = false;
        this.dialogRef.close();
    }

}

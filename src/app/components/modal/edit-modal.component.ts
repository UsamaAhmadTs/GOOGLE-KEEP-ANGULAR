import {Component, OnInit, Inject, Input} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
    @ Input() searchLabelText: string = '';
    notes: Note[] = []
    selectedNote!: Note;
    labelTitle: string = '';
    constructor(@Inject(MAT_DIALOG_DATA) public data: { note: Note },
                private notesService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>) {
        this.notesService.getNotes().subscribe((notes) => {
            this.notes = notes;
        });
    }

    ngOnInit() {
        this.selectedNote = this.data.note;
        this.dialogRef.afterClosed().subscribe(() => {
            this.updateNote(this.selectedNote)
        });
    }

    toggleDropdownMenu(note: Note, event: Event) {
        event.stopPropagation();
        note.showDropdownMenu = !note.showDropdownMenu;
        if (note.showDropdownMenu) {
            note.showLabelMenu = false;
        }
    }

    toggleLabelMenu(note: Note, event: Event) {
        event.stopPropagation();
        note.showLabelMenu = !note.showLabelMenu;
        note.showDropdownMenu = !note.showDropdownMenu;
    }

    deleteNote(noteToDelete: Note) {
        this.notesService.deleteNotes(noteToDelete).subscribe({
            next: updatedNotes => {
                this.notes = updatedNotes;
                this.dialogRef.close();
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
        this.dialogRef.close();
    }

}

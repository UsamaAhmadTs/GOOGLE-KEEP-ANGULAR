import {Component, OnInit, Inject, Input} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";
import {Label} from "../label";
import {v4 as uuidv4} from "uuid";

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
        selectedNote.display = false;
        this.dialogRef.close();
    }
    stopPropagation(event: Event) {
        event.stopPropagation();
    }

    onMouseEnter(label: Label) {
        label.showCancel = true;
    }

    onMouseLeave(label: Label) {
        label.showCancel = false;
    }
    associateLabelWithNote(label: Label, note: Note) {
        this.notesService.associateLabelWithNote(label, note).subscribe();
    }
    createLabel(labelTitle: string, note: Note) {
        if (labelTitle) {
            const newLabel: Label = {
                labelId: uuidv4(),
                labelTitle: labelTitle,
                showCancel: false
            };
            this.notesService.createLabel(newLabel, note);
            this.associateLabelWithNote(newLabel, note);
        }
    }
}

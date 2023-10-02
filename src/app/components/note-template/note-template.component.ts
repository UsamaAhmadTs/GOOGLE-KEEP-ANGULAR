import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable} from "rxjs";

import {Label} from "../label";

import {v4 as uuidv4} from 'uuid';


@Component({
    selector: 'app-note-template',
    templateUrl: './note-template.component.html',
    styleUrls: ['./note-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class NoteTemplateComponent implements OnInit {
    @Input() isArchiveNote: boolean = false;
    @Input() highLight: boolean = false;

    showMixedNotes: boolean = false;
    highlightedSearchQuery: string | null = null;
    notes: Note[] = []
    labels: Label[] = [];
    filteredNotes: Note[] | null = null;
    searchQuery$!: Observable<string | null>;
    selectedNote!: Note | null;
    labelTitle: string = '';

    constructor(private noteService: NotesService, private dialog: MatDialog) {
        this.searchQuery$ = this.noteService.searchQuery$;
    }

    ngOnInit() {
        this.noteService.getNotes().subscribe((notes) => {
            this.notes = notes;
        });
        this.noteService.getLabels().subscribe(labels => {
            this.labels = labels;
        });
        this.noteService.getFilteredNotes().subscribe(filteredNotes => {
            this.filteredNotes = filteredNotes.reverse();
            this.showMixedNotes = false;
        });
        this.searchQuery$.subscribe(query => {
            this.highlightedSearchQuery = query;
        });
    }

    toggleDropdownMenu(note: Note, event: Event) {
        event.stopPropagation();
        note.showDropdownMenu = !note.showDropdownMenu;
    }

    toggleLabelMenu(note: Note, event: Event) {
        event.stopPropagation();
        note.showLabelMenu = !note.showLabelMenu;
    }

    highlightMatches(text: string, query: string | null): string {
        if (query === null || query.trim() === '') return text;
        const regex = new RegExp(query, 'gi');
        return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
    }

    onNoteSelected(note: Note) {
        this.selectedNote = note;
        note.display = true;
        const dialogRef = this.dialog.open(EditModalComponent, {
            data: {note},
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    deleteNote(noteToDelete: Note) {
        this.noteService.deleteNotes(noteToDelete).subscribe({
            next: updatedNotes => {
                this.notes = updatedNotes;
            }
        });
    }

    archiveNote(note: Note) {
        note.isArchived = !note.isArchived;
        this.noteService.archiveNotes(note).subscribe(updatedNotes => {
            this.notes = updatedNotes;
            this.selectedNote = null;
        });
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }

    createLabel(labelTitle: string, note: Note) {
        if (labelTitle) {
            const newLabel: Label = {
                labelId: uuidv4(),
                labelTitle: labelTitle,
                isPathVisible: true
            };
            this.noteService.createLabel(newLabel, note);
            this.associateLabelWithNote(newLabel, note);
        }
    }

    associateLabelWithNote(label: Label, note: Note) {
        label.isPathVisible = !label.isPathVisible;
        this.noteService.associateLabelWithNote(label, note).subscribe();
    }

    deleteLabel(label: Label, note: Note): void {
        this.noteService.deleteLabel(label).subscribe(updatedLabels => {
            this.labels = updatedLabels;
        });
    }

}

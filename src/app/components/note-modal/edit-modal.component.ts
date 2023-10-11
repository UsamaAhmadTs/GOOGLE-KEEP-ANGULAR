import {Component, OnInit, Inject, Input, HostListener} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {Router} from "@angular/router";

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
              private notesService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>, private router: Router) {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

  ngOnInit() {
    this.selectedNote = this.data.note;
    this.dialogRef.afterClosed().subscribe(() => {
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
    if (this.router.url === '/search'){
      this.notesService.deleteSearchNotes(noteToDelete).subscribe(updatedNotes => {
        this.notes = (updatedNotes);
        this.dialogRef.close();
      });
    }
    else if (noteToDelete.isArchived){
      this.notesService.deleteArchiveNotes(noteToDelete).subscribe({
        next: updatedNotes => {
          this.notes = (updatedNotes.reverse());
          this.dialogRef.close();
        }
      });
    }
    else {this.notesService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes = (updatedNotes.reverse());
        this.dialogRef.close();
      }
    });}

  }

  updateNote(selectedNote: Note) {
    this.notesService.updateNote(selectedNote);
    this.dialogRef.close();
  }
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (!this.selectedNote.showDropdownMenu) return;
    const targetElement = event.target as HTMLElement;
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownMenu?.contains(targetElement)) {
      this.selectedNote.showDropdownMenu = false;
    }
  }

}

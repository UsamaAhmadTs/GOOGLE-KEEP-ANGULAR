import {Component, OnInit, Inject, Input, HostListener, ElementRef, ViewChild} from '@angular/core';

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
  @ViewChild('noteText') noteText!: ElementRef;
  @ViewChild('noteTitle') noteTitle!: ElementRef;
  notes: Note[] = []
  selectedNote!: Note;
  labelTitle: string = '';
  previousTextArea!: string |undefined

  constructor(@Inject(MAT_DIALOG_DATA) public data: { note: Note, titleHeight: number, textHeight: number  },
              private notesService: NotesService, private dialogRef: MatDialogRef<EditModalComponent>,
              private router: Router,private elementRef: ElementRef) {
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
      this.previousTextArea = this.selectedNote.noteTitle;
      this.titleHeight();
      this.textHeight();
    });
    window.addEventListener('beforeunload', () => {
      this.dialogRef.close();
    });
    setTimeout(() => {
      this.noteTitle.nativeElement.focus();
    }, 1);
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
    });
    }
  }
  moveFocusToNoteText(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const noteTextElement = this.elementRef.nativeElement.querySelector('.note-text');
      noteTextElement.focus();
    }
  }

  titleHeight() {
    const title = this.noteTitle.nativeElement;
    const noteTextArea = this.selectedNote.noteTitle;
    if (title.style.height !== '56px') {
      title.style.height = '0';
    }
    const newHeight = Math.max(title.scrollHeight, 56);
    title.style.height = `${newHeight}px`;
    this.previousTextArea = noteTextArea;
    if (!noteTextArea) {
      title.style.height = `${56}px`;
    }
    this.textHeight()
  }

  textHeight() {
    const text = this.noteText.nativeElement;
    const initial = this.selectedNote.noteText;
    text.style.height = '0';
    const newHeight = Math.max(text.scrollHeight, 57.6);
    text.style.height = `${newHeight}px`;
    if (!initial) {
      text.style.height = `${57.6}px`;
    }
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


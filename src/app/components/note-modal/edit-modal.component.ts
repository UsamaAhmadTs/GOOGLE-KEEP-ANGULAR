import {Component, OnInit, Inject, Input, HostListener, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit,AfterViewInit {
  @ Input() searchLabelText: string = '';
  @ViewChild('noteText') noteText!: ElementRef;
  @ViewChild('noteTitle') noteTitle!: ElementRef;
  notes: Note[] = []
  selectedNote!: Note;
  labelTitle: string = '';

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



  // @ViewChild('textAreas') textAreasRef!: ElementRef;
  // @ViewChild('label') labelRef!: ElementRef;
  // previousNoteTitle: string = ''; // Add this property to store the previous noteTitle
  //
  // adjustLabelContainerHeight() {
  //   const textAreasElement = this.labelRef.nativeElement as HTMLElement;
  //   const labelContainer = document.querySelector('.text-areas') as HTMLElement;
  //   const textAreasRect = textAreasElement.getBoundingClientRect();
  //   const textAreasHeight = textAreasRect.height;
  //   labelContainer.style.height = textAreasHeight + 'px';
  // }
  //
  // adjustTitleAreaHeight(event: Event) {
  //   const textarea = event.target as HTMLTextAreaElement;
  //   textarea.style.height = '0';
  //   textarea.style.overflowY = 'hidden';
  //   textarea.style.lineHeight = '1rem';
  //   const minHeight = 0;
  //   const newHeight = Math.min(Math.max(minHeight, textarea.scrollHeight), 400);
  //   textarea.style.height = `${newHeight}px`;
  //   textarea.style.overflowY = newHeight === 643 ? 'scroll' : 'hidden';
  //   this.adjustLabelContainerHeight();
  // }
  adjustTitleAreaHeight(): void {
    const textarea = document.getElementsByClassName("note-title")[0] as HTMLTextAreaElement;
    textarea.style.height = '0';
    textarea.style.height = (textarea.scrollHeight) + 'px';
    this.adjustTextAreaHeight()
  }
  adjustTextAreaHeight(): void {
    const textarea = document.getElementsByClassName("note-text")[0] as HTMLTextAreaElement;
    textarea.style.height = '0';
    textarea.style.height = textarea.textLength + 'px';
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

  ngAfterViewInit(): void {

  }
}

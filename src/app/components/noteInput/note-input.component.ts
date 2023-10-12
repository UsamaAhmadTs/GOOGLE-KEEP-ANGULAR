import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';

import {Note} from "../note";

import {FormBuilder, FormGroup} from "@angular/forms";

import {NotesService} from "../notes-service";

import {v4 as uuidv4} from "uuid";

import {Subscription} from "rxjs";

@Component({
  selector: 'app-input',
  templateUrl: './note-input.component.html',
  styleUrls: ['./note-input.component.scss']
})
export class NoteInputComponent implements OnInit {
  @ViewChild('dropNote') dropNote!: ElementRef;
  @ViewChild('mainNote') mainNote!: ElementRef;
  @ViewChild('noteTextarea') noteTextarea!: ElementRef;
  @ViewChild('noteTextTitle') noteTitleArea!: ElementRef;
  note!: Note;
  showFirst = true;
  notes!: FormGroup;
  private notesSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private notesService: NotesService
    , private renderer: Renderer2, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.notes = this.formBuilder.group({
      title: '',
      note: ''
    })
  }

  moveFocusToNoteText(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const noteTextElement = this.elementRef.nativeElement.querySelector('.note-text');
      noteTextElement.focus();
    }
  }

  adjustTitleAreaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = '0';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = '0';
    textarea.style.overflowY = 'hidden';
    const minHeight = 0;
    const newHeight = Math.min(Math.max(minHeight, textarea.scrollHeight), 643);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight === 643 ? 'scroll' : 'hidden';
  }

  createNote(isArchived: boolean) {
    const title = this.notes.value.title;
    const noteText = this.notes.value.note;
    const hasNonSpaceTitle = /\S/.test(title);
    const hasNonSpaceNoteText = /\S/.test(noteText);
    if ((hasNonSpaceTitle || hasNonSpaceNoteText) && (title || noteText)) {
      const newNote: Note = {
        noteId: uuidv4(),
        noteTitle: title || '',
        noteText: noteText || '',
        isArchived,
        display: false,
        showDropdownMenu: false,
        labels: [],
        showLabelMenu: false
      };
      this.notesSubscription = this.notesService.createNote(newNote).subscribe(updatedNotes => {
        this.notes.reset();
        this.showFirst = !this.showFirst;
      });
    } else {
      this.showFirst = !this.showFirst;
    }
  }

  toggleDivs() {
    this.showFirst = !this.showFirst
    if (!this.showFirst) {
      setTimeout(() => {
        const inputElement = document.querySelector('.note-text');
        this.renderer.selectRootElement(inputElement).focus();
      }, 0);
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element.closest('.form-container') && this.showFirst === false) {
      this.createNote(false);
    }
  }

  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }

}

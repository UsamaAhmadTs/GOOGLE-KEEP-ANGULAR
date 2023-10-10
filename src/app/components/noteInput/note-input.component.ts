import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';

import {Note} from "../note";

import {FormBuilder, FormGroup} from "@angular/forms";

import {NotesService} from "../notes-service";

import {v4 as uuidv4} from "uuid";
import {Subscription} from "rxjs";
import {auto} from "@popperjs/core";

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
              , private renderer: Renderer2,private elementRef: ElementRef) {
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
  minimumNoteTextHeight: number = 46;
  minimumNoteTitleHeight: number = 58;
  addTop: number = 17;
  adjustTextHeight(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newTextHeight = Math.max(target.scrollHeight, this.minimumNoteTextHeight);

    // If there is already newline in the note, increase the height of the note title by 10px
    const additionalTitleHeight = this.noteTextarea.nativeElement.height > this.minimumNoteTitleHeight ? 10 : 0;
    target.style.height = 'auto';
    target.style.height = `${newTextHeight}px`;

    // Increase the height of the note title
    const titleInput = this.noteTitleArea.nativeElement;
    titleInput.style.height = 'auto';
    titleInput.style.height = `${titleInput.scrollHeight + additionalTitleHeight}px`;
    this.adjustTopPositionText();
    this.adjustParentContainerHeight();
    if (titleInput.style.height == this.minimumNoteTitleHeight + 'px') {
      titleInput.style.top = `${this.addTop}px`;
    }
  }
  addNoteTextHeight: number = 46;
  addNoteTitleHeight: number = 56;
  adjustTopPositionText(): void {
    const titleInput = this.noteTitleArea.nativeElement;
    const newTitleHeight = titleInput.scrollHeight;
    const textInput = this.noteTextarea.nativeElement;
    const newTextHeight = textInput.scrollHeight;
    const topPosition = newTextHeight > this.addNoteTextHeight ? 2 : -4;
    textInput.style.top = `${newTitleHeight > this.addNoteTitleHeight ? Math.min(topPosition, 6) : -4}px`;
  }
  addNoteTop: number = 40;
  adjustParentContainerHeight(): void {
    const parentContainer = this.dropNote.nativeElement;
    const newTitleHeight = this.noteTitleArea.nativeElement.scrollHeight;
    const newTextHeight = this.noteTextarea.nativeElement.scrollHeight;

    if (newTitleHeight > this.minimumNoteTitleHeight || newTextHeight > this.addNoteTextHeight) {
      parentContainer.style.height = `${newTitleHeight + newTextHeight + this.addNoteTop}px`;
    } else if (newTitleHeight == this.minimumNoteTitleHeight) {

      this.noteTextarea.nativeElement.style.top = '-5px';

    } else if (newTextHeight == this.addNoteTextHeight) {

      this.noteTitleArea.nativeElement.style.top = '32px';
    }
  }
  adjustTitleHeight(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
    this.adjustTopPositionTitle();
    this.adjustParentContainerHeight();
  }
  adjustTopPositionTitle(): void {
    const titleInput = this.noteTitleArea.nativeElement;
    const newTitleHeight = titleInput.scrollHeight;
    const textInput = this.noteTextarea.nativeElement;
    const newTextHeight = textInput.scrollHeight;
    const maxTopPosition = 6; // Maximum allowed top position
    const totalHeight = newTitleHeight + newTextHeight;
    textInput.style.top = `${totalHeight > this.addNoteTitleHeight ? Math.min(maxTopPosition, 6) : -4}px`;
  }
  maxHeightOFNoteText: number = 400;
  showScrollbar(): boolean {
    const container = this.dropNote?.nativeElement?.querySelector('.note-text');
    if (container) {
      const maxHeight = window.innerHeight - container.getBoundingClientRect().top; // Adjust as needed
      container.style.maxHeight = `${maxHeight}px`;
      const actualHeight = container.clientHeight;

      return actualHeight > this.maxHeightOFNoteText;
    }
    return false; // Return false by default if container is not found
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
    }
    else {
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

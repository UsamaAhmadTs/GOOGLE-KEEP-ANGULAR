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
  note!: Note;
  showFirst = true;
  notes!: FormGroup;
  private notesSubscription!: Subscription;
  constructor(private formBuilder: FormBuilder, private notesService: NotesService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.notes = this.formBuilder.group({
      title: '',
      note: ''
    })
  }

  createNote(isArchived: boolean) {
    const title = this.notes.value.title;
    const noteText = this.notes.value.note;

    if (title || noteText) {
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

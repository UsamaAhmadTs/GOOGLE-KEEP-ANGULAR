import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

import {Note} from "../note";

import {FormBuilder, FormGroup} from "@angular/forms";

import {NotesService} from "../notes-service";

import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @ViewChild('dropNote') dropNote!: ElementRef;
  @ViewChild('mainNote') mainNote!: ElementRef;

  showFirst = true;
  showDropdownMenu = false;
  notes!: FormGroup;

  constructor(private formBuilder: FormBuilder, private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.notes = this.formBuilder.group({
      title: '',
      note: ''
    })
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.dropNote.nativeElement.contains(event.target)) {
      this.createNote();
    }
  }

  createNote() {
    const title = this.notes.value.title;
    const noteText = this.notes.value.note;
    if (title || noteText) {
      const newNote: Note = {
        noteId: uuidv4(),
        noteTitle: title || '',
        noteText: noteText || '',
        isArchived: false,
        display: false,
        showDropdownMenu: false,
        labels: [],
        showLabelMenu: false
      };
      this.notesService.createNote(newNote).subscribe(updatedNotes => {
        this.notes.reset();
        this.showFirst = !this.showFirst;
      });
    }
  }

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  toggleDivs() {
    this.showFirst = !this.showFirst;
  }

}

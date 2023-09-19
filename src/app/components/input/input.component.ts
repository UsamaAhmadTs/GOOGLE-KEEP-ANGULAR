import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {Note} from "../note";

import {FormBuilder, FormGroup} from "@angular/forms";

import {NotesService} from "../notes-service";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  showFirst = true;
  showDropdownMenu = false;
  @Output() createNoteRefreshEvent = new EventEmitter<any>();

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  toggleDivs() {
    this.showFirst = !this.showFirst;
  }

  constructor(private formBuilder: FormBuilder, private notesService: NotesService) {
  }

  notes!: FormGroup;

  ngOnInit(): void {
    this.notes = this.formBuilder.group({
      title: [''],
      note: ['']
    })
  }

  createNote() {
    const title = this.notes.value.title;
    const noteText = this.notes.value.note;
    if (title && noteText) {
      const newNote: Note = {
        noteTitle: title || 'Untitled',
        noteText: noteText || 'No text',
        isArchived: false
      };
      this.notesService.createNote(newNote).subscribe((result) => {
        this.createNoteRefreshEvent.emit(result);
      });
      this.notes.reset();
      this.showFirst = !this.showFirst;
    }
  }

  addLabel() {
  }

}

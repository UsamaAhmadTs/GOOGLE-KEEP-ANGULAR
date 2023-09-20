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
  @Output() createNoteRefreshEvent = new EventEmitter<any>();
  showFirst = true;
  showDropdownMenu = false;

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
      title: '',
      note: ''
    })
  }

  createNote() {
    const title = this.notes.value.title;
    const noteText = this.notes.value.note;
    let highestNoteId = parseInt(localStorage.getItem('highestNoteId') || '0', 10);
    if (title && noteText) {
      const newNote: Note = {
        noteId: highestNoteId + 1,
        noteTitle: title || 'Untitled',
        noteText: noteText || 'No text',
        isArchived: false,
        display: false,
        showDropdownMenu: false
      };
      this.notesService.createNote(newNote).subscribe((result) => {
        this.createNoteRefreshEvent.emit(result);
      });
      localStorage.setItem('highestNoteId', (highestNoteId + 1).toString());
      this.notes.reset();
      this.showFirst = !this.showFirst;
    }
  }

  addLabel() {
  }

}

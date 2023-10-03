import {Component, OnInit} from '@angular/core';

import {Note} from "../note";

import {BehaviorSubject} from 'rxjs';

import {FormBuilder, FormGroup} from "@angular/forms";

import {NotesService} from "../notes-service";

import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();
  showFirst = true;
  showDropdownMenu = false;
  notes!: FormGroup;

  constructor(private formBuilder: FormBuilder, private notesService: NotesService) {
    this.notesService.getNotes().subscribe(notes => {
      this.notesSubject.next(notes);
    });
  }

  ngOnInit(): void {
    this.notesService.getNotes().subscribe(notes => {
      this.notesSubject.next(notes);
    });
    this.notes = this.formBuilder.group({
      title: '',
      note: ''
    })
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
        this.notesSubject.next(updatedNotes);
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

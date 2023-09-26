import {Component, OnInit} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];

  constructor(private notesService: NotesService) {
  }

  selectedNote: Note | null = null;

  ngOnInit() {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

  handleSelectedNoteChanged(selectedNote: Note | null) {
    this.selectedNote = selectedNote;
    console.log('Received selectedNote:', selectedNote);
  }

}

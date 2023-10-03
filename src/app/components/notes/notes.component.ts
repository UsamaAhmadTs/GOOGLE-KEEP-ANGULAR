import {Component} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent{

  notes: Note[] = [];

  constructor(private notesService: NotesService) {
    this.notesService.getNotes().subscribe((notes) => {
      this.notes = notes.reverse();
    });
  }

}

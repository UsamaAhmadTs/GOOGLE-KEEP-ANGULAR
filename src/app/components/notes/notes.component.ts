import {Component} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {defaultIfEmpty, map, Observable} from "rxjs";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent{
  notes$: Observable<Note[]>;
  notesPresent$!: Observable<number>;
  archiveNotesPresent$!: Observable<boolean>;
  constructor(private noteService: NotesService) {
    this.notes$ = this.noteService.getNotes();
    this.notesPresent$ = this.notes$.pipe(
      map((notes) => notes.length),
      defaultIfEmpty(0)
    );
    this.archiveNotesPresent$ = this.notes$.pipe(
      map(notes => notes.every(note => note.isArchived))
    );
  }

}

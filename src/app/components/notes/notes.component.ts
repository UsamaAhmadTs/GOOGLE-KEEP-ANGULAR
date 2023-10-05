import {Component} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {defaultIfEmpty, map, Observable} from "rxjs";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  notes$: Observable<Note[]> = this.notesService.notesSubject.asObservable();
  archivePresent$: Observable<boolean>;
  notesPresent$: Observable<boolean>;

  constructor(private notesService: NotesService) {
    this.notes$ = this.notesService.getNotes();
    this.notes$.subscribe((notes) => {
      this.notes$ = new Observable((observer) => {
        observer.next(notes);
        observer.complete();
      });
    });
    this.archivePresent$ = this.notes$.pipe(
      map(notes => notes.every(note => note.isArchived))
    );

    this.notesPresent$ = this.notes$.pipe(
      map(notes => notes.length > 0),
      defaultIfEmpty(false)
    );
  }
}

import {Component, OnDestroy} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {defaultIfEmpty, map, Observable, of, Subscription} from "rxjs";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnDestroy{
  notes$!: Observable<Note[]>;
  notesPresent$!: Observable<number>;
  archiveNotesPresent$!: Observable<boolean>;
  private getNotesSubscription: Subscription;
  constructor(private noteService: NotesService) {
    this.noteService.getNotes();
    this.getNotesSubscription = this.noteService.notesSubject.subscribe(notes => {
      this.notes$ = of(notes);
    });
    this.notesPresent$ = this.notes$.pipe(
      map((notes) => notes.length),
      defaultIfEmpty(0)
    );
    this.archiveNotesPresent$ = this.notes$.pipe(
      map(notes => notes.every(note => note.isArchived))
    );
  }
  ngOnDestroy() {
    if (this.getNotesSubscription) {
      this.getNotesSubscription.unsubscribe();
    }
  }
}

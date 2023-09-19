import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from "rxjs";

import {Note} from './note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  filteredNotes: Note[] = [];
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  getFilteredNotes(query: string): Note[] {
    return this.filteredNotes.filter(note =>
      note.noteTitle.toLowerCase().includes(query.toLowerCase()) ||
      note.noteText.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getNotesListFromLocalStorage(): Note[] { // Updated return type
    const notesListString = localStorage.getItem('notesList');
    return notesListString ? JSON.parse(notesListString) : [];
  }

  private setNotesListToLocalStorage(notesList: Note[]): void {
    localStorage.setItem('notesList', JSON.stringify(notesList));
  }

  getArchivedNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const archivedNotes = notesList.filter(note => note.isArchived);
    return new Observable<Note[]>((observer) => {
      observer.next(archivedNotes);
      observer.complete();
    });
  }

  createNote(newNote: Note): Observable<Note> {
    const notesList = this.getNotesListFromLocalStorage();
    notesList.push(newNote);
    this.setNotesListToLocalStorage(notesList);

    return new Observable<Note>((observer) => {
      observer.next(newNote);
      observer.complete();
    });
  }

  getNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    return new Observable<Note[]>((observer) => {
      observer.next(notesList);
      observer.complete();
    });
  }

  deleteNotes(newNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.filter(note => note.noteTitle !== newNote.noteTitle);
    this.setNotesListToLocalStorage(updatedNotes);
    return new Observable<Note[]>((observer) => {
      observer.next(updatedNotes);
      observer.complete();
    });
  }

  archiveNotes(archiveNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.map(note => {
      if (note.noteTitle === archiveNote.noteTitle) {
        return {...note, ...archiveNote};
      }
      return note;
    });
    this.setNotesListToLocalStorage(updatedNotes);
    return new Observable<Note[]>((observer) => {
      observer.next(updatedNotes);
      observer.complete();
    });
  }
}

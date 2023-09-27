import {Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, of} from "rxjs";

import {Note} from './note';
import {Label} from "./label";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  labels: string[] = [];

  getLabels(): Observable<string[]> {
    return of(this.labels);
  }

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();

  setSearchQuery(searchQuery$: string) {
    this.searchQuerySubject.next(searchQuery$);
  }

  getFilteredNotes(): Observable<Note[]> {
    return this.searchQuerySubject.pipe(
      map(searchQuery => {
        const trimmedQuery = searchQuery.trim().toLowerCase();
        if (trimmedQuery === '') {
          return [];
        }
        const notesList = this.getNotesListFromLocalStorage();
        return notesList.filter(note =>
          note.noteTitle?.toLowerCase().includes(trimmedQuery) ||
          note.noteText?.toLowerCase().includes(trimmedQuery)
        );
      })
    );
  }

  private getNotesListFromLocalStorage(): Note[] {
    const notesListString = localStorage.getItem('notesList');
    return notesListString ? JSON.parse(notesListString) : [];
  }

  private setNotesListToLocalStorage(notesList: Note[]): void {
    localStorage.setItem('notesList', JSON.stringify(notesList));
  }

  getArchivedNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const archivedNotes = notesList.filter(note => note.isArchived);
    return of(archivedNotes)
  }

  createNote(newNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    notesList.push(newNote);
    this.setNotesListToLocalStorage(notesList);

    return of(notesList);
  }

  getNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    return of(notesList);
  }

  deleteNotes(newNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.filter(note => note.noteTitle !== newNote.noteTitle);
    this.setNotesListToLocalStorage(updatedNotes);
    return of(updatedNotes);
  }

  archiveNotes(archiveNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.map(note => {
      if (note.noteTitle === archiveNote.noteTitle) {
        return {...note, ...archiveNote, display: false};
      }
      return note;
    });
    this.setNotesListToLocalStorage(updatedNotes);
    return of(updatedNotes);
  }

  updateNote(updatedNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);
    if (index !== -1) {
      notesList[index] = updatedNote;
      this.setNotesListToLocalStorage(notesList);
      this.setNoteDisplayToLocalStorage(updatedNote);
    }
    return of(notesList);
  }

  private setNoteDisplayToLocalStorage(updatedNote: Note): void {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);

    if (index !== -1) {
      notesList[index].display = false;
      this.setNotesListToLocalStorage(notesList);
    }
  }

}

import {Injectable, OnDestroy} from '@angular/core';

import {BehaviorSubject, map, Observable, of, Subscription} from "rxjs";

import {Note} from './note';

@Injectable({
  providedIn: 'root'
})
export class NotesService{
  private notes: Note[] = [];
  notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();
  filteredNotesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  filteredNotes$: Observable<Note[]> = this.filteredNotesSubject.asObservable();

  setSearchQuery(searchQuery$: string) {
    this.searchQuerySubject.next(searchQuery$);
  }

  dropdownsClose(noteSelected: Note): void {
    this.notes.forEach((note) => {
      if ((note.showDropdownMenu || note.showLabelMenu) && note !== noteSelected) {
        note.showDropdownMenu = false;
        note.showLabelMenu = false;
      }
    });
  }

  dropClose(): void {
    this.notes.forEach((note) => {
      if ((note.showDropdownMenu || note.showLabelMenu)) {
        note.showDropdownMenu = false;
        note.showLabelMenu = false;
      }
    });
  }

  getNotes(): void {
    const notesList = this.getNotesListFromLocalStorage();
    this.notesSubject.next(notesList);
    this.notesSubject.next(notesList.reverse());
    this.notes = notesList;
  }

  getFilteredNotes(): Observable<Note[]> {
    this.dropClose();
    return this.searchQuerySubject.pipe(
      map(searchQuery => {
        const trimmedQuery = searchQuery.trim().toLowerCase();
        if (trimmedQuery === '') {
          this.filteredNotesSubject.next([]);
          return [];
        }
        const notesList = this.getNotesListFromLocalStorage();
        const filteredNotes = notesList.filter(note =>
          note.noteTitle?.toLowerCase().includes(trimmedQuery) ||
          note.noteText?.toLowerCase().includes(trimmedQuery) ||
          note.labels.some(label => label.labelTitle.toLowerCase().includes(trimmedQuery))
        );
        this.filteredNotesSubject.next(filteredNotes);
        return filteredNotes;
      })
    );
  }

  getNotesListFromLocalStorage(): Note[] {
    const notesListString = localStorage.getItem('notesList');
    return notesListString ? JSON.parse(notesListString) : [];
  }

  setNotesListToLocalStorage(notesList: Note[]): void {
    localStorage.setItem('notesList', JSON.stringify(notesList));
  }

  getArchivedNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const archivedNotes = notesList.filter(note => note.isArchived);
    this.notesSubject.next(notesList);
    return of(archivedNotes)
  }

  createNote(newNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    notesList.push(newNote);
    this.setNotesListToLocalStorage(notesList);
    this.notesSubject.next(notesList);
    return of(notesList);
  }


  deleteNotes(newNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.filter(note => note.noteId !== newNote.noteId);
    this.setNotesListToLocalStorage(updatedNotes);

    this.notesSubject.next(notesList);
    return of(updatedNotes);
  }

  archiveNotes(archiveNote: Note): Observable<Note[]> {
    this.dropClose()
    const notesList = this.getNotesListFromLocalStorage();
    const updatedNotes = notesList.map(note => {
      if (note.noteId === archiveNote.noteId) {
        return {...note, ...archiveNote, display: false};
      }
      return note;
    });
    this.setNotesListToLocalStorage(updatedNotes);
    this.notesSubject.next(notesList);
    return of(updatedNotes);
  }

  updateNote(updatedNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);
    if (index !== -1) {
      notesList[index] = updatedNote;
      this.setNotesListToLocalStorage(notesList);
      this.notesSubject.next(notesList);
    }
    return of(notesList);
  }

  isMixedNotes(): boolean {
    const filteredNotes = this.filteredNotesSubject.getValue();
    const archived = filteredNotes.some(note => note.isArchived);
    const unArchived = filteredNotes.some(note => !note.isArchived);

    return archived && unArchived;
  }

  setNoteDisplayToLocalStorage(updatedNote: Note): void {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);

    if (index !== -1) {
      notesList[index].display = true;
      this.setNotesListToLocalStorage(notesList);
      this.notesSubject.next(notesList);
    }
  }

}

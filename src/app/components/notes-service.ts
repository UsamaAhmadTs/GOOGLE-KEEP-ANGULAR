import {Injectable} from '@angular/core';

import {BehaviorSubject, map, Observable, of, tap} from "rxjs";

import {Note} from './note';

import {Label} from "./label";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notes: Note[] = [];
  private labels: Label[] = [];
   notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();
   filteredNotesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  filteredNotes$: Observable<Note[]> = this.filteredNotesSubject.asObservable();


  constructor() {
    this.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
    this.getLabels().subscribe((labels) => {
      this.labels = labels;
    });
  }

  setSearchQuery(searchQuery$: string) {
    this.searchQuerySubject.next(searchQuery$);
  }

  getNotes(): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    this.notesSubject.next(notesList);
    return this.notesSubject.asObservable();

  }
  getLabels(): Observable<Label[]> {
    const labelsList = this.getLabelsFromLocalStorage();
    this.labelsSubject.next(labelsList);
    return this.labelsSubject.asObservable();
  }
  getFilteredNotes(): Observable<Note[]> {
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

  // getFilteredNotes(): Observable<Note[]> {
  //   return this.searchQuerySubject.pipe(
  //     map(searchQuery => {
  //       const trimmedQuery = searchQuery.trim().toLowerCase();
  //       if (trimmedQuery === '') {
  //         return [];
  //       }
  //       const notesList = this.getNotesListFromLocalStorage();
  //       return notesList.filter(note =>
  //         note.noteTitle?.toLowerCase().includes(trimmedQuery) ||
  //         note.noteText?.toLowerCase().includes(trimmedQuery) ||
  //         note.labels.some(label => label.labelTitle.toLowerCase().includes(trimmedQuery))
  //       );
  //     })
  //   );
  // }

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
    const updatedNotes = notesList.filter(note => note.noteTitle !== newNote.noteTitle);
    this.setNotesListToLocalStorage(updatedNotes);
    this.notesSubject.next(notesList);
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
    this.notesSubject.next(notesList);
    return of(updatedNotes);
  }

  updateNote(updatedNote: Note): Observable<Note[]> {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);
    if (index !== -1) {
      notesList[index] = updatedNote;
      this.setNoteDisplayToLocalStorage(updatedNote)
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
      notesList[index].display = !notesList[index].display;
      this.setNotesListToLocalStorage(notesList);
      this.notesSubject.next(notesList);
    }
  }

  private getLabelsFromLocalStorage(): Label[] {
    const labelsString = localStorage.getItem('labels');
    return labelsString ? JSON.parse(labelsString) : [];
  }

  private setLabelsToLocalStorage(labels: Label[]): void {
    localStorage.setItem('labels', JSON.stringify(labels));
  }

  createLabel(newLabel: Label, note: Note): Observable<Label[]> {
    const labels: Label[] = this.labels;
    const existingLabel = labels.find(label => label.labelTitle === newLabel.labelTitle);

    if (existingLabel) {
      return of([existingLabel]);
    }
    labels.push(newLabel);
    this.setLabelsToLocalStorage(labels);
    return of(labels);
  }

  deleteLabel(labelToDelete: Label): Observable<Label[]> {
    const labelsList = this.getLabelsFromLocalStorage();
    const updatedLabels = labelsList.filter(label => label.labelTitle !== labelToDelete.labelTitle);
    this.setLabelsToLocalStorage(updatedLabels);
    return of(updatedLabels);
  }

  associateLabelWithNote(label: Label, note: Note): Observable<Label[]> {
    if (!note.labels) {
      note.labels = [];
    }

    const labelIndex = note.labels.findIndex(l => l.labelId === label.labelId);

    if (labelIndex !== -1) {
      note.labels.splice(labelIndex, 1);
    } else {
      note.labels.push(label);

    }
    this.setNoteLabelsToLocalStorage(note);
    return of(note.labels);
  }

  private setNoteLabelsToLocalStorage(updatedNote: Note): void {
    const notesList = this.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);

    if (index !== -1) {
      notesList[index].labels = updatedNote.labels;
      this.setNotesListToLocalStorage(notesList);
    }
  }

  searchLabels(searchText: string): Observable<Label[]> {
    const labelsList = this.getLabelsFromLocalStorage();
    const filteredLabels = labelsList.filter(label =>
      label.labelTitle.toLowerCase().includes(searchText.toLowerCase())
    );
    return of(filteredLabels);
  }

}

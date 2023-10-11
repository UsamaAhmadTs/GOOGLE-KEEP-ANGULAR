import {Injectable, OnDestroy} from '@angular/core';

import {Label} from "./label";

import {Note} from "./note";

import {BehaviorSubject, Observable, of, Subscription} from "rxjs";

import {NotesService} from "./notes-service";

@Injectable({
  providedIn: 'root'
})
export class LabelService{
  private labels: Label[] = [];
  labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);

  constructor(private noteService: NotesService) {
  }

  getLabels(): void {
    const labelsList = this.getLabelsFromLocalStorage();
    this.labelsSubject.next(labelsList);
    this.labelsSubject.next(labelsList.reverse());
    this.labels = labelsList;
  }

  private getLabelsFromLocalStorage(): Label[] {
    const labelsString = localStorage.getItem('labels');
    return labelsString ? JSON.parse(labelsString) : [];
  }

  private setLabelsToLocalStorage(labels: Label[]): void {
    localStorage.setItem('labels', JSON.stringify(labels));
  }

  createLabel(newLabel: Label): Observable<Label[]> {
    const labels: Label[] = this.labels;
    const existingLabel = labels.find(label => label.labelTitle === newLabel.labelTitle);

    if (existingLabel) {
      return of([existingLabel]);
    }
    labels.push(newLabel);
    this.setLabelsToLocalStorage(labels);
    return of(labels);
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
    const notesList = this.noteService.getNotesListFromLocalStorage();
    const index = notesList.findIndex(note => note.noteId === updatedNote.noteId);

    if (index !== -1) {
      notesList[index].labels = updatedNote.labels;
      this.noteService.setNotesListToLocalStorage(notesList);
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

import {Injectable, OnDestroy} from '@angular/core';

import {Label} from "./label";

import {Note} from "./note";

import {BehaviorSubject, Observable, of, Subscription} from "rxjs";

import {NotesService} from "./notes-service";

@Injectable({
  providedIn: 'root'
})
export class LabelService implements OnDestroy{
  private labels: Label[] = [];
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  private getLabelsSubscription: Subscription;

  constructor(private noteService: NotesService) {
    this.getLabelsSubscription = this.getLabels().subscribe((labels) => {
      this.labels = labels;
    });
  }

  getLabels(): Observable<Label[]> {
    const labelsList = this.getLabelsFromLocalStorage();
    this.labelsSubject.next(labelsList);
    return this.labelsSubject.asObservable();
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
  ngOnDestroy() {
    if (this.getLabelsSubscription) {
      this.getLabelsSubscription.unsubscribe();
    }
  }
}

import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable, of, Subscription} from "rxjs";

import {Label} from "../label";
import {LabelService} from "../label.service";

@Component({
  selector: 'app-note-template',
  templateUrl: './note-template.component.html',
  styleUrls: ['./note-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NoteTemplateComponent implements OnInit, OnDestroy {
  @Input() isArchiveNote: boolean = false;
  @Input() highLight: boolean = false;
  @Input() display: boolean = false;

  showMixedNotes: boolean = false;
  highlightedSearchQuery: string | null = null;
  notes$: Observable<Note[]> = this.noteService.notesSubject.asObservable();
  labels: Label[] = [];
  filteredNotes: Note[] | null = null;
  searchQuery$!: Observable<string | null>;
  labelTitle: string = '';
  selectedNote: Note | null = null;

  private notesSubscription: Subscription;
  private labelsSubscription: Subscription;
  private filteredNotesSubscription: Subscription;
  private searchQuerySubscription!: Subscription;
  private afterClosedSubscription!: Subscription;
  private archiveNotesSubscription!: Subscription;
  private deleteNotesSubscription!: Subscription;
  private getNotesSubscription: Subscription;
  constructor(private noteService: NotesService,private labelService: LabelService, private dialog: MatDialog, private renderer: Renderer2) {
    this.searchQuery$ = this.noteService.searchQuery$;
    this.noteService.getNotes();
    this.getNotesSubscription = this.noteService.notesSubject.subscribe(notes => {
      this.notes$ = of(notes);
    });
    this.notesSubscription = this.notes$.subscribe((notes) => {
      this.notes$ = new Observable((observer) => {
        observer.next(notes);
        observer.complete();
      });
    });
    this.labelService.getLabels();
    this.labelsSubscription = this.labelService.labelsSubject.subscribe(labels => {
      this.labels = labels;
    });
    this.filteredNotesSubscription = this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filteredNotes = filteredNotes.reverse();
      this.showMixedNotes = false;
    });
  }

  ngOnInit() {
    this.searchQuerySubscription = this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });
    this.noteService.dropClose()
  }

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    this.noteService.dropdownsClose(note);
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }
  toggleLabelMenu(note: Note, event: Event) {
    event.stopPropagation();
    note.showLabelMenu = !note.showLabelMenu;
    note.showDropdownMenu = !note.showDropdownMenu;
  }

  highlightMatches(text: string, query: string | null): string {
    if (query === null || query.trim() === '') return text;
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="highlighted">${match}</span>`);
  }

  onNoteSelected(note: Note) {
    this.noteService.setNoteDisplayToLocalStorage(note)
    this.selectedNote = note
    if (note.showDropdownMenu || note.showLabelMenu) {
      note.showDropdownMenu = false;
      note.showLabelMenu = false;
    }
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: {note}
    });

    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      this.selectedNote=null
    });
  }

  deleteNote(noteToDelete: Note, event: Event) {
    this.deleteNotesSubscription = this.noteService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes$ = of(updatedNotes.reverse());
      }
    });
    event.stopPropagation();
  }

  archiveNote(note: Note) {
    note.isArchived = !note.isArchived;
    this.archiveNotesSubscription = this.noteService.archiveNotes(note).subscribe(updatedNotes => {
      this.notes$ = of(updatedNotes);
    });
  }
  ngOnDestroy() {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.labelsSubscription) {
      this.labelsSubscription.unsubscribe();
    }
    if (this.filteredNotesSubscription) {
      this.filteredNotesSubscription.unsubscribe();
    }
    if (this.deleteNotesSubscription) {
      this.deleteNotesSubscription.unsubscribe();
    }
    if (this.archiveNotesSubscription) {
      this.archiveNotesSubscription.unsubscribe();
    }
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
    if (this.afterClosedSubscription) {
      this.afterClosedSubscription.unsubscribe();
    }
    if (this.getNotesSubscription) {
      this.getNotesSubscription.unsubscribe();
    }
  }
}

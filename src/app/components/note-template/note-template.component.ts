import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {EditModalComponent} from "../note-modal/edit-modal.component";

import {MatDialog} from "@angular/material/dialog";

import {Observable, of, Subscription} from "rxjs";

import {Router} from "@angular/router";

import {animate, style, transition, trigger} from "@angular/animations";
import {LabelService} from "../label.service";
import {LabelMenuComponent} from "../label-menu/label-menu.component";

@Component({
  selector: 'app-note-template',
  templateUrl: './note-template.component.html',
  styleUrls: ['./note-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('noteAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateX(-20px)' })),
      ]),
    ]),
  ],
})
export class NoteTemplateComponent implements OnInit {
  @Input() isArchiveNote: boolean = false;
  @Input() highLight: boolean = false;
  @Input() display: boolean = false;

  showMixedNotes: boolean = false;
  highlightedSearchQuery: string | null = null;
  notes$: Observable<Note[]> = this.noteService.notesSubject.asObservable();
  filterNotes: Note[] = [];
  filteredNotes$: Observable<Note[]>;
  searchQuery$!: Observable<string | null>;
  selectedNote: Note | null = null;
  searchLabelText: string = '';
  constructor(private noteService: NotesService,
              private dialog: MatDialog,private router: Router,private labelService: LabelService) {
    this.searchQuery$ = this.noteService.searchQuery$;
    this.notes$ = this.noteService.getNotes();
    this.notes$.subscribe((notes) => {
      this.notes$ = new Observable((observer) => {
        observer.next(notes);
        observer.complete();
      });
    });
    this.filteredNotes$ = this.noteService.filteredNotes$;
  }

  ngOnInit() {
    this.searchQuery$.subscribe(query => {
      this.highlightedSearchQuery = query;
    });
   this.filteredNotes$.subscribe((filteredNotes) => {
      this.filterNotes = filteredNotes;
    });
    this.labelService.labelTitle$.subscribe(title => {
      this.labelTitle = title;
    });
    this.noteService.dropClose()
      this.noteService.getFilteredNotes().subscribe(filteredNotes => {
      this.filterNotes = filteredNotes
      this.showMixedNotes = false;
    });
  }

  archiveNote(note: Note) {
    if (this.router.url === '/search'){
      this.noteService.archiveSearchNotes(note).subscribe(({ updatedNotes }) => {
        this.notes$ = of(updatedNotes);
      });
      this.filteredNotes$ = this.noteService.filteredNotes$;
    }
    else if (!note.isArchived){
      note.isArchived = !note.isArchived;
      this.noteService.archiveNotes(note).subscribe(updatedNotes => {
        this.notes$ = of(updatedNotes);
      });
    }else {
      note.isArchived = !note.isArchived;
      this.noteService.archiveNotesfromArchive(note).subscribe(updatedNotes => {
        this.notes$ = of(updatedNotes);
      });
    }
  }
  labelTitle!: string ;

  toggleDropdownMenu(note: Note, event: Event) {
    event.stopPropagation();
    this.noteService.dropdownsClose(note);
    note.showDropdownMenu = !note.showDropdownMenu;
    if (note.showDropdownMenu) {
      note.showLabelMenu = false;
    }
  }
  toggleLabelMenu(note: Note, event: Event) {
    this.labelService.setLabelTitle('');
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
    this.noteService.setNoteDisplayToLocalStorage(note.noteId)
    this.selectedNote = note
    if (note.showDropdownMenu || note.showLabelMenu) {
      note.showDropdownMenu = false;
      note.showLabelMenu = false;
    }
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: {note}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selectedNote=null
    });
  }

  deleteNote(noteToDelete: Note, event: Event) {
    if (this.router.url === '/search'){
      this.noteService.deleteSearchNotes(noteToDelete).subscribe(updatedNotes => {
        this.notes$ = of(updatedNotes);
      });
    }
    else if (noteToDelete.isArchived){
      this.noteService.deleteArchiveNotes(noteToDelete).subscribe({
        next: updatedNotes => {
          this.notes$ = of(updatedNotes.reverse());
        }
      });
    }
    else {this.noteService.deleteNotes(noteToDelete).subscribe({
      next: updatedNotes => {
        this.notes$ = of(updatedNotes.reverse());
      }
    });
    }
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element.closest('.note')) {
      this.labelTitle = ''
      this.labelService.setLabelTitle('');
      this.noteService.dropClose()
    }
  }

}

import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {NotesService} from "../notes-service";

import {Note} from "../note";

import {Observable} from "rxjs";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class SearchComponent implements OnInit {

    filteredNotes: Note[] | null = null;
    searchQuery$: Observable<string | null>;
    showMixedNotes: boolean = false;

    constructor(private noteService: NotesService) {
        this.searchQuery$ = this.noteService.searchQuery$;
    }

    ngOnInit(): void {
        this.noteService.getFilteredNotes().subscribe(filteredNotes => {
            this.filteredNotes = filteredNotes.reverse();
            this.showMixedNotes = false;
            const hasMixedArchivedStatus = this.filteredNotes.some(note => note.isArchived)
                && this.filteredNotes.some(note => !note.isArchived);
            if (hasMixedArchivedStatus) {
                this.showMixedNotes = true;
            }
        });
    }

}

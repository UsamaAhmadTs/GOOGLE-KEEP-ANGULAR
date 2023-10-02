import {Component,OnInit} from '@angular/core';

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {Observable} from "rxjs";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  archiveNotes$!: Observable<Note[]>;
  constructor(private notesService: NotesService) {
  }
  ngOnInit() {
    this.archiveNotes$ = this.notesService.getArchivedNotes();
  }

}

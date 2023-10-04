import {Component, Input} from '@angular/core';

import {Label} from "../label";

import {Note} from "../note";

import {NotesService} from "../notes-service";

import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-label-menu',
  templateUrl: './label-menu.component.html',
  styleUrls: ['./label-menu.component.scss']
})
export class LabelMenuComponent {
  @Input() labelDropdown: boolean = false;
  @Input() DialogBoxOpen: boolean = false;
  @Input() note!: Note;
  @ Input() searchLabelText: string = '';
  labels: Label[] = [];
  searchLabels: Label[] = [];
  labelTitle: string = '';
  openedFromEditModal: boolean = true;

  constructor(private noteService: NotesService) {
    this.noteService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
  }

  associateLabelWithNote(label: Label, note: Note) {

    this.noteService.associateLabelWithNote(label, note).subscribe();
  }

  createLabel(labelTitle: string, note: Note) {
    if (labelTitle) {
      const newLabel: Label = {
        labelId: uuidv4(),
        labelTitle: labelTitle,
        showCancel: false
      };
      this.noteService.createLabel(newLabel, note);
      this.associateLabelWithNote(newLabel, note);
      this.labelTitle = '';
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  searchLabel(): void {
    if (this.labelTitle) {
      this.noteService.searchLabels(this.labelTitle).subscribe(filteredLabels => {
        this.searchLabels = filteredLabels;
      });
    }
  }

  checkedBox(note: Note, findLabel: Label): boolean {
    const found = note.labels.find(label => label.labelId === findLabel.labelId);
    return !!found;
  }
}

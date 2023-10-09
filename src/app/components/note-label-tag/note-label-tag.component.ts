import {Component, Input} from '@angular/core';

import {Note} from "../note";

import {Label} from "../label";

import {LabelService} from "../label.service";

@Component({
  selector: 'app-note-label-tag',
  templateUrl: './note-label-tag.component.html',
  styleUrls: ['./note-label-tag.component.scss']
})
export class NoteLabelTagComponent {
  @Input() note!: Note;
  @Input() showAdditionalLabels: boolean = true;
  @Input() slice: boolean = true;

  constructor(private labelService: LabelService) {
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onMouseEnter(label: Label) {
    label.showCancel = true;
  }

  onMouseLeave(label: Label) {
    label.showCancel = false;
  }

  shouldShowAdditionalLabels(note: Note): boolean {
    return note.labels.length > 2;
  }

  associateLabelWithNote(label: Label, note: Note) {
    this.labelService.associateLabelWithNote(label, note).subscribe();
  }
  transform(value: string, words: number): string {
    if (!value) return '';
    const wordArray = value.split(' ');
    return wordArray.slice(0, words).join(' ') + (wordArray.length > words ? '...' : '');
  }
}
